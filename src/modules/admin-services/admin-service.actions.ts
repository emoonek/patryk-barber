"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/modules/auth/auth.guards";
import {
  adminCreateServiceSchema,
  adminServiceIdSchema,
  adminUpdateServiceSchema,
} from "./admin-service.schemas";
import { createAdminService, setAdminServiceActive, updateAdminService } from "./admin-service.service";

const INTERNAL_SERVICE_DURATION_MINUTES = 60;

export type AdminServiceActionState = {
  ok?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function validationError(errors: Record<string, string[] | undefined>): AdminServiceActionState {
  return {
    ok: false,
    message: "Popraw bledy w formularzu.",
    errors: Object.fromEntries(
      Object.entries(errors).filter((entry): entry is [string, string[]] => Boolean(entry[1]?.length)),
    ),
  };
}

function failure(error: unknown, fallback: string): AdminServiceActionState {
  return {
    ok: false,
    message: error instanceof Error ? error.message : fallback,
  };
}

export async function adminCreateServiceAction(
  _state: AdminServiceActionState,
  formData: FormData,
): Promise<AdminServiceActionState> {
  await requireAdmin();
  const parsed = adminCreateServiceSchema.safeParse({
    name: formValue(formData, "name"),
    priceCents: formValue(formData, "priceCents"),
    durationMinutes: INTERNAL_SERVICE_DURATION_MINUTES,
    isActive: formData.get("isActive") ?? "",
    sortOrder: formValue(formData, "sortOrder"),
  });

  if (!parsed.success) {
    return validationError(parsed.error.flatten().fieldErrors);
  }

  try {
    await createAdminService(parsed.data);
  } catch (error) {
    return failure(error, "Nie udalo sie dodac uslugi.");
  }

  revalidateServicePaths();
  return { ok: true, message: "Usluga zostala dodana." };
}

export async function adminUpdateServiceAction(
  _state: AdminServiceActionState,
  formData: FormData,
): Promise<AdminServiceActionState> {
  await requireAdmin();
  const parsed = adminUpdateServiceSchema.safeParse({
    serviceId: formValue(formData, "serviceId"),
    name: formValue(formData, "name"),
    priceCents: formValue(formData, "priceCents"),
    durationMinutes: INTERNAL_SERVICE_DURATION_MINUTES,
    isActive: formData.get("isActive") ?? "",
    sortOrder: formValue(formData, "sortOrder"),
  });

  if (!parsed.success) {
    return validationError(parsed.error.flatten().fieldErrors);
  }

  try {
    await updateAdminService(parsed.data);
  } catch (error) {
    return failure(error, "Nie udalo sie zapisac uslugi.");
  }

  revalidateServicePaths();
  return { ok: true, message: "Usluga zostala zapisana." };
}

export async function adminToggleServiceActiveAction(formData: FormData) {
  await requireAdmin();
  const parsed = adminServiceIdSchema
    .extend({
      isActive: adminCreateServiceSchema.shape.isActive,
    })
    .safeParse({
      serviceId: formValue(formData, "serviceId"),
      isActive: formData.get("isActive") ?? "",
    });

  if (!parsed.success) {
    return;
  }

  await setAdminServiceActive(parsed.data.serviceId, parsed.data.isActive);
  revalidateServicePaths();
}

function revalidateServicePaths() {
  revalidatePath("/admin");
  revalidatePath("/admin/uslugi");
  revalidatePath("/admin/rezerwacje/nowa");
  revalidatePath("/admin/dostepnosc");
  revalidatePath("/rezerwacja");
}
