"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/modules/auth/auth.guards";
import { validateImageFile } from "@/lib/storage";
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

function formFile(formData: FormData, key: string) {
  const value = formData.get(key);
  return value instanceof File && value.size > 0 ? value : null;
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
  const imageFile = formFile(formData, "imageFile");
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

  if (!imageFile && !parsed.data.imageUrl) {
    return validationError({
      imageUrl: ["Podaj adres zdjecia albo wybierz plik do uploadu."],
    });
  }

  if (imageFile) {
    const fileError = validateImageFile(imageFile);

    if (fileError) {
      return validationError({
        [fileError.field]: [fileError.message],
      });
    }
  }

  try {
    await createGalleryImage({ ...parsed.data, imageFile }, admin.id);
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
  const imageFile = formFile(formData, "imageFile");
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

  if (!imageFile && !parsed.data.imageUrl) {
    return validationError({
      imageUrl: ["Podaj adres zdjecia albo wybierz plik do uploadu."],
    });
  }

  if (imageFile) {
    const fileError = validateImageFile(imageFile);

    if (fileError) {
      return validationError({
        [fileError.field]: [fileError.message],
      });
    }
  }

  try {
    await updateGalleryImage({ ...parsed.data, imageFile });
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

export async function deleteGalleryImageAction(
  _state: GalleryActionState,
  formData: FormData,
): Promise<GalleryActionState> {
  await requireAdmin();
  const parsed = galleryImageIdSchema.safeParse({
    imageId: formValue(formData, "imageId"),
  });

  if (!parsed.success) {
    return { ok: false, message: "Brakuje identyfikatora zdjecia." };
  }

  try {
    await deleteGalleryImage(parsed.data.imageId);
  } catch (error) {
    return failure(error, "Nie udalo sie usunac zdjecia.");
  }

  revalidateGalleryPaths();
  return { ok: true, message: "Zdjecie zostalo usuniete." };
}

function revalidateGalleryPaths() {
  revalidatePath("/");
  revalidatePath("/galeria");
  revalidatePath("/admin");
  revalidatePath("/admin/galeria");
}
