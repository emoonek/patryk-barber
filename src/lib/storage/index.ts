import { v2 as cloudinary, type UploadApiOptions, type UploadApiResponse } from "cloudinary";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const REQUIRED_CLOUDINARY_ENV = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "CLOUDINARY_FOLDER",
] as const;

export type StoredImage = {
  imageUrl: string;
  thumbnailUrl?: string;
  storageKey: string;
};

export type StorageValidationError = {
  field: "imageFile";
  message: string;
};

export type CloudinaryConfigStatus = {
  isConfigured: boolean;
  missingKeys: string[];
};

export function getCloudinaryConfigStatus(): CloudinaryConfigStatus {
  const missingKeys = REQUIRED_CLOUDINARY_ENV.filter((key) => !process.env[key]?.trim());

  return {
    isConfigured: missingKeys.length === 0,
    missingKeys,
  };
}

export function validateImageFile(file: File): StorageValidationError | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return {
      field: "imageFile",
      message: "Dozwolone sa tylko pliki JPG, PNG albo WebP.",
    };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      field: "imageFile",
      message: "Plik moze miec maksymalnie 5 MB.",
    };
  }

  return null;
}

export async function uploadImage(file: File): Promise<StoredImage> {
  const validationError = validateImageFile(file);

  if (validationError) {
    throw new Error(validationError.message);
  }

  return cloudinaryStorage.uploadImage(file);
}

export async function deleteImage(storageKey: string): Promise<void> {
  await cloudinaryStorage.deleteImage(storageKey);
}

type CloudinaryConfig = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  folder: string;
};

class CloudinaryStorage {
  async uploadImage(file: File): Promise<StoredImage> {
    const config = getCloudinaryConfig();
    configureCloudinary(config);

    let result: UploadApiResponse;

    try {
      result = await uploadFileBuffer(Buffer.from(await file.arrayBuffer()), {
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        folder: config.folder,
        resource_type: "image",
      });
    } catch {
      throw new Error("Nie udalo sie wyslac zdjecia do Cloudinary. Sprawdz konfiguracje i sprobuj ponownie.");
    }

    if (!result.secure_url || !result.public_id) {
      throw new Error("Cloudinary nie zwrocilo poprawnych danych zdjecia.");
    }

    return {
      imageUrl: result.secure_url,
      thumbnailUrl: buildCloudinaryThumbnailUrl(result.secure_url),
      storageKey: result.public_id,
    };
  }

  async deleteImage(storageKey: string): Promise<void> {
    const config = getCloudinaryConfig();
    configureCloudinary(config);

    try {
      const result = await cloudinary.uploader.destroy(storageKey, {
        invalidate: true,
        resource_type: "image",
      });

      if (result.result !== "ok" && result.result !== "not found") {
        throw new Error("Cloudinary destroy failed.");
      }
    } catch {
      throw new Error("Nie udalo sie usunac zdjecia ze storage. Sprawdz konfiguracje Cloudinary.");
    }
  }
}

function getCloudinaryConfig(): CloudinaryConfig {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
  const folder = process.env.CLOUDINARY_FOLDER?.trim();
  const status = getCloudinaryConfigStatus();

  if (!status.isConfigured || !cloudName || !apiKey || !apiSecret || !folder) {
    throw new Error(
      `Cloudinary nie jest skonfigurowane. Brakuje: ${status.missingKeys.join(", ")}. Upload plików nie będzie działał, dopóki nie uzupełnisz zmiennych w .env.`,
    );
  }

  return {
    cloudName,
    apiKey,
    apiSecret,
    folder,
  };
}

function configureCloudinary(config: CloudinaryConfig) {
  cloudinary.config({
    cloud_name: config.cloudName,
    api_key: config.apiKey,
    api_secret: config.apiSecret,
    secure: true,
  });
}

function uploadFileBuffer(buffer: Buffer, options: UploadApiOptions): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error || !result) {
        reject(error ?? new Error("Cloudinary upload did not return a result."));
        return;
      }

      resolve(result);
    });

    uploadStream.end(buffer);
  });
}

function buildCloudinaryThumbnailUrl(imageUrl: string) {
  return imageUrl.replace("/upload/", "/upload/c_fill,w_480,h_480,q_auto,f_auto/");
}

const cloudinaryStorage = new CloudinaryStorage();
