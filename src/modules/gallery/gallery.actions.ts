"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/modules/auth/auth.guards";
import {
  createGalleryImageSchema,
  galleryCheckboxBooleanSchema,
  galleryImageIdSchema,
  updateGalleryImageSchema,
} from "./gallery.schemas";
import {
  createGalleryImage,
  deleteGalleryImage,
  setGalleryImageVisible,
  updateGalleryImage,
} from "./gallery.service";

export type GalleryActionState = {
  ok?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function validationError(errors: Record<string, string[] | undefined>): GalleryActionState {
  return {
    ok: false,
    message: "Popraw bledy w formularzu.",
    errors: Object.fromEntries(
      Object.entries(errors).filter((entry): entry is [string, string[]] => Boolean(entry[1]?.length)),
    ),
  };
}

function failure(error: unknown, fallback: string): GalleryActionState {
  return {
    ok: false,
    message: error instanceof Error ? error.message : fallback,
  };
}

export async function createGalleryImageAction(
  _state: GalleryActionState,
  formData: FormData,
): Promise<GalleryActionState> {
  const admin = await requireAdmin();
  const parsed = createGalleryImageSchema.safeParse({
    imageUrl: formValue(formData, "imageUrl"),
    altText: formValue(formData, "altText"),
    caption: formValue(formData, "caption"),
    sortOrder: formValue(formData, "sortOrder"),
    isVisible: formData.get("isVisible") ?? "",
  });

  if (!parsed.success) {
    return validationError(parsed.error.flatten().fieldErrors);
  }

  try {
    await createGalleryImage(parsed.data, admin.id);
  } catch (error) {
    return failure(error, "Nie udalo sie dodac zdjecia.");
  }

  revalidateGalleryPaths();
  return { ok: true, message: "Zdjecie zostalo dodane." };
}

export async function updateGalleryImageAction(
  _state: GalleryActionState,
  formData: FormData,
): Promise<GalleryActionState> {
  await requireAdmin();
  const parsed = updateGalleryImageSchema.safeParse({
    imageId: formValue(formData, "imageId"),
    imageUrl: formValue(formData, "imageUrl"),
    altText: formValue(formData, "altText"),
    caption: formValue(formData, "caption"),
    sortOrder: formValue(formData, "sortOrder"),
    isVisible: formData.get("isVisible") ?? "",
  });

  if (!parsed.success) {
    return validationError(parsed.error.flatten().fieldErrors);
  }

  try {
    await updateGalleryImage(parsed.data);
  } catch (error) {
    return failure(error, "Nie udalo sie zapisac zdjecia.");
  }

  revalidateGalleryPaths();
  return { ok: true, message: "Zdjecie zostalo zapisane." };
}

export async function toggleGalleryImageVisibleAction(formData: FormData) {
  await requireAdmin();
  const parsed = galleryImageIdSchema
    .extend({
      isVisible: galleryCheckboxBooleanSchema,
    })
    .safeParse({
      imageId: formValue(formData, "imageId"),
      isVisible: formData.get("isVisible") ?? "",
    });

  if (!parsed.success) {
    return;
  }

  await setGalleryImageVisible(parsed.data.imageId, parsed.data.isVisible);
  revalidateGalleryPaths();
}

export async function deleteGalleryImageAction(formData: FormData) {
  await requireAdmin();
  const parsed = galleryImageIdSchema.safeParse({
    imageId: formValue(formData, "imageId"),
  });

  if (!parsed.success) {
    return;
  }

  await deleteGalleryImage(parsed.data.imageId);
  revalidateGalleryPaths();
}

function revalidateGalleryPaths() {
  revalidatePath("/");
  revalidatePath("/galeria");
  revalidatePath("/admin");
  revalidatePath("/admin/galeria");
}
