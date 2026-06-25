import { prisma } from "@/lib/db/prisma";

export function listVisibleGalleryImages() {
  return prisma.galleryImage.findMany({
    where: {
      isPublished: true,
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      title: true,
      altText: true,
      imageUrl: true,
      thumbnailUrl: true,
      sortOrder: true,
    },
  });
}

export function listAdminGalleryImages() {
  return prisma.galleryImage.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      title: true,
      altText: true,
      imageUrl: true,
      thumbnailUrl: true,
      sortOrder: true,
      isPublished: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export function getAdminGalleryImage(imageId: string) {
  return prisma.galleryImage.findUnique({
    where: { id: imageId },
    select: {
      id: true,
      title: true,
      altText: true,
      imageUrl: true,
      sortOrder: true,
      isPublished: true,
    },
  });
}
