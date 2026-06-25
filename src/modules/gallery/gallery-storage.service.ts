export type GalleryStorageInput = {
  imageUrl: string;
};

export type GalleryStoredImage = {
  imageUrl: string;
  thumbnailUrl?: string;
};

export interface GalleryStorageService {
  prepareImage(input: GalleryStorageInput): Promise<GalleryStoredImage>;
  deleteImage?(imageUrl: string): Promise<void>;
}

class DevelopmentUrlStorageService implements GalleryStorageService {
  async prepareImage(input: GalleryStorageInput): Promise<GalleryStoredImage> {
    return {
      imageUrl: input.imageUrl.trim(),
    };
  }
}

export const galleryStorage: GalleryStorageService = new DevelopmentUrlStorageService();
