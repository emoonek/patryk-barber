import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { deleteImage, uploadImage } from "@/lib/storage";
import type { CreateGalleryImageInput, UpdateGalleryImageInput } from "./gallery.schemas";

type CreateGalleryImagePayload = CreateGalleryImageInput & {
  imageFile: File | null;
};

type UpdateGalleryImagePayload = UpdateGalleryImageInput & {
  imageFile: File | null;
};

export async function createGalleryImage(input: CreateGalleryImagePayload, uploadedById?: string) {
  const storedImage = input.imageFile
    ? await uploadImage(input.imageFile)
    : {
        imageUrl: input.imageUrl.trim(),
        thumbnailUrl: null,
        storageKey: null,
      };

  try {
    await prisma.galleryImage.create({
      data: {
        imageUrl: storedImage.imageUrl,
        thumbnailUrl: storedImage.thumbnailUrl,
        storageKey: storedImage.storageKey,
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

export async function updateGalleryImage(input: UpdateGalleryImagePayload) {
  const existingImage = await prisma.galleryImage.findUnique({
    where: { id: input.imageId },
    select: { storageKey: true },
  });

  if (!existingImage) {
    throw new Error("Nie znaleziono zdjecia galerii.");
  }

  const storedImage = input.imageFile
    ? await uploadImage(input.imageFile)
    : {
        imageUrl: input.imageUrl.trim(),
        thumbnailUrl: null,
        storageKey: null,
      };

  try {
    await prisma.galleryImage.update({
      where: { id: input.imageId },
      data: {
        imageUrl: storedImage.imageUrl,
        thumbnailUrl: storedImage.thumbnailUrl,
        storageKey: storedImage.storageKey,
        altText: input.altText,
        title: input.caption,
        sortOrder: input.sortOrder,
        isPublished: input.isVisible,
      },
    });

    if (existingImage.storageKey && existingImage.storageKey !== storedImage.storageKey) {
      await deleteImage(existingImage.storageKey).catch(() => undefined);
    }
  } catch (error) {
    if (input.imageFile && storedImage.storageKey) {
      await deleteImage(storedImage.storageKey).catch(() => undefined);
    }

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
    const image = await prisma.galleryImage.findUnique({
      where: { id: imageId },
      select: { storageKey: true },
    });

    if (!image) {
      throw new Error("Nie znaleziono zdjecia galerii.");
    }

    if (image.storageKey) {
      await deleteImage(image.storageKey);
    }

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
