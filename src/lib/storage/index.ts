import crypto from "node:crypto";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export type StoredImage = {
  imageUrl: string;
  thumbnailUrl?: string;
  storageKey: string;
};

export type StorageValidationError = {
  field: "imageFile";
  message: string;
};

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
  folder?: string;
};

class CloudinaryStorage {
  async uploadImage(file: File): Promise<StoredImage> {
    const config = getCloudinaryConfig();
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const paramsToSign: Record<string, string> = { timestamp };

    if (config.folder) {
      paramsToSign.folder = config.folder;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", config.apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signCloudinaryParams(paramsToSign, config.apiSecret));

    if (config.folder) {
      formData.append("folder", config.folder);
    }

    const response = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Nie udalo sie wyslac zdjecia do Cloudinary. Sprawdz konfiguracje i sprobuj ponownie.");
    }

    const result = (await response.json()) as {
      secure_url?: string;
      public_id?: string;
    };

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
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const paramsToSign = {
      public_id: storageKey,
      timestamp,
    };

    const formData = new FormData();
    formData.append("public_id", storageKey);
    formData.append("api_key", config.apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signCloudinaryParams(paramsToSign, config.apiSecret));

    const response = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/image/destroy`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Nie udalo sie usunac zdjecia ze storage. Sprawdz konfiguracje Cloudinary.");
    }
  }
}

function getCloudinaryConfig(): CloudinaryConfig {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Brakuje konfiguracji Cloudinary. Uzupelnij zmienne CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY i CLOUDINARY_API_SECRET.");
  }

  return {
    cloudName,
    apiKey,
    apiSecret,
    folder: process.env.CLOUDINARY_FOLDER?.trim() || undefined,
  };
}

function signCloudinaryParams(params: Record<string, string>, apiSecret: string) {
  const payload = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return crypto.createHash("sha1").update(`${payload}${apiSecret}`).digest("hex");
}

function buildCloudinaryThumbnailUrl(imageUrl: string) {
  return imageUrl.replace("/upload/", "/upload/c_fill,w_480,h_480,q_auto,f_auto/");
}

const cloudinaryStorage = new CloudinaryStorage();
