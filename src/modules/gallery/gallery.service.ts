import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { galleryStorage } from "./gallery-storage.service";
import type { CreateGalleryImageInput, UpdateGalleryImageInput } from "./gallery.schemas";

export async function createGalleryImage(input: CreateGalleryImageInput, uploadedById?: string) {
  const storedImage = await galleryStorage.prepareImage({ imageUrl: input.imageUrl });

  try {
    await prisma.galleryImage.create({
      data: {
        imageUrl: storedImage.imageUrl,
        thumbnailUrl: storedImage.thumbnailUrl,
        altText: input.altText,
        title: input.caption,
        sortOrder: input.sortOrder,
        isPublished: input.isVisible,
        uploadedById,
      },
    });
  } catch (error) {
    handleGalleryWriteError(error, "Nie udalo sie dodac zdjecia.");
  }
}

export async function updateGalleryImage(input: UpdateGalleryImageInput) {
  const storedImage = await galleryStorage.prepareImage({ imageUrl: input.imageUrl });

  try {
    await prisma.galleryImage.update({
      where: { id: input.imageId },
      data: {
        imageUrl: storedImage.imageUrl,
        thumbnailUrl: storedImage.thumbnailUrl,
        altText: input.altText,
        title: input.caption,
        sortOrder: input.sortOrder,
        isPublished: input.isVisible,
      },
    });
  } catch (error) {
    handleGalleryWriteError(error, "Nie udalo sie zapisac zdjecia.");
  }
}

export async function setGalleryImageVisible(imageId: string, isVisible: boolean) {
  try {
    await prisma.galleryImage.update({
      where: { id: imageId },
      data: { isPublished: isVisible },
    });
  } catch (error) {
    handleGalleryWriteError(error, "Nie udalo sie zmienic widocznosci zdjecia.");
  }
}

export async function deleteGalleryImage(imageId: string) {
  try {
    await prisma.galleryImage.delete({
      where: { id: imageId },
    });
  } catch (error) {
    handleGalleryWriteError(error, "Nie udalo sie usunac zdjecia.");
  }
}

function handleGalleryWriteError(error: unknown, fallback: string): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
    throw new Error("Nie znaleziono zdjecia galerii.");
  }

  throw error instanceof Error ? error : new Error(fallback);
}
