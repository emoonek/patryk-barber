import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import type { AdminCreateServiceInput, AdminUpdateServiceInput } from "./admin-service.schemas";

export async function createAdminService(input: AdminCreateServiceInput) {
  const slug = await uniqueServiceSlug(input.name);

  try {
    await prisma.service.create({
      data: {
        name: input.name,
        slug,
        priceCents: input.priceCents,
        durationMinutes: input.durationMinutes,
        isActive: input.isActive,
        sortOrder: input.sortOrder,
      },
    });
  } catch (error) {
    handleServiceWriteError(error, "Nie udalo sie dodac uslugi.");
  }
}

export async function updateAdminService(input: AdminUpdateServiceInput) {
  try {
    await prisma.service.update({
      where: { id: input.serviceId },
      data: {
        name: input.name,
        priceCents: input.priceCents,
        durationMinutes: input.durationMinutes,
        isActive: input.isActive,
        sortOrder: input.sortOrder,
      },
    });
  } catch (error) {
    handleServiceWriteError(error, "Nie udalo sie zapisac uslugi.");
  }
}

export async function setAdminServiceActive(serviceId: string, isActive: boolean) {
  try {
    await prisma.service.update({
      where: { id: serviceId },
      data: { isActive },
    });
  } catch (error) {
    handleServiceWriteError(error, "Nie udalo sie zmienic statusu uslugi.");
  }
}

async function uniqueServiceSlug(name: string) {
  const baseSlug = slugify(name) || "usluga";
  let slug = baseSlug;
  let suffix = 2;

  while (await prisma.service.findUnique({ where: { slug }, select: { id: true } })) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function handleServiceWriteError(error: unknown, fallback: string): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      throw new Error("Usluga o takiej nazwie juz istnieje.");
    }

    if (error.code === "P2025") {
      throw new Error("Nie znaleziono uslugi.");
    }
  }

  throw error instanceof Error ? error : new Error(fallback);
}
