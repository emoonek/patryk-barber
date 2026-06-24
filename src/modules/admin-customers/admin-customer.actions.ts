"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/modules/auth/auth.guards";
import {
  adminBlockCustomerSchema,
  adminCreateCustomerNoteSchema,
  adminDeleteCustomerNoteSchema,
  adminUpdateCustomerSchema,
} from "./admin-customer.schemas";
import {
  blockAdminCustomer,
  createAdminCustomerNote,
  deleteAdminCustomerNote,
  unblockAdminCustomer,
  updateAdminCustomer,
} from "./admin-customer.service";

export type AdminCustomerActionState = {
  ok?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function validationError(errors: Record<string, string[] | undefined>): AdminCustomerActionState {
  return {
    ok: false,
    message: "Popraw bledy w formularzu.",
    errors: Object.fromEntries(
      Object.entries(errors).filter((entry): entry is [string, string[]] => Boolean(entry[1]?.length)),
    ),
  };
}

function failure(error: unknown, fallback: string): AdminCustomerActionState {
  return {
    ok: false,
    message: error instanceof Error ? error.message : fallback,
  };
}

export async function adminUpdateCustomerAction(
  _state: AdminCustomerActionState,
  formData: FormData,
): Promise<AdminCustomerActionState> {
  await requireAdmin();
  const parsed = adminUpdateCustomerSchema.safeParse({
    clientId: formValue(formData, "clientId"),
    firstName: formValue(formData, "firstName"),
    lastName: formValue(formData, "lastName"),
    phone: formValue(formData, "phone"),
  });

  if (!parsed.success) {
    return validationError(parsed.error.flatten().fieldErrors);
  }

  try {
    await updateAdminCustomer(parsed.data);
  } catch (error) {
    return failure(error, "Nie udalo sie zapisac danych klienta.");
  }

  revalidateCustomerPaths(parsed.data.clientId);
  return { ok: true, message: "Dane klienta zostaly zapisane." };
}

export async function adminBlockCustomerAction(
  _state: AdminCustomerActionState,
  formData: FormData,
): Promise<AdminCustomerActionState> {
  const admin = await requireAdmin();
  const parsed = adminBlockCustomerSchema.safeParse({
    clientId: formValue(formData, "clientId"),
    reason: formValue(formData, "reason"),
  });

  if (!parsed.success) {
    return validationError(parsed.error.flatten().fieldErrors);
  }

  try {
    await blockAdminCustomer(admin.id, parsed.data);
  } catch (error) {
    return failure(error, "Nie udalo sie zablokowac klienta.");
  }

  revalidateCustomerPaths(parsed.data.clientId);
  return { ok: true, message: "Klient zostal zablokowany." };
}

export async function adminUnblockCustomerAction(formData: FormData) {
  await requireAdmin();
  const parsed = adminBlockCustomerSchema.pick({ clientId: true }).safeParse({
    clientId: formValue(formData, "clientId"),
  });

  if (!parsed.success) {
    return;
  }

  await unblockAdminCustomer(parsed.data.clientId);
  revalidateCustomerPaths(parsed.data.clientId);
}

export async function adminCreateCustomerNoteAction(
  _state: AdminCustomerActionState,
  formData: FormData,
): Promise<AdminCustomerActionState> {
  const admin = await requireAdmin();
  const parsed = adminCreateCustomerNoteSchema.safeParse({
    clientId: formValue(formData, "clientId"),
    content: formValue(formData, "content"),
  });

  if (!parsed.success) {
    return validationError(parsed.error.flatten().fieldErrors);
  }

  try {
    await createAdminCustomerNote(admin.id, parsed.data);
  } catch (error) {
    return failure(error, "Nie udalo sie dodac notatki.");
  }

  revalidateCustomerPaths(parsed.data.clientId);
  return { ok: true, message: "Notatka zostala dodana." };
}

export async function adminDeleteCustomerNoteAction(formData: FormData) {
  await requireAdmin();
  const parsed = adminDeleteCustomerNoteSchema.safeParse({
    clientId: formValue(formData, "clientId"),
    noteId: formValue(formData, "noteId"),
  });

  if (!parsed.success) {
    return;
  }

  await deleteAdminCustomerNote(parsed.data);
  revalidateCustomerPaths(parsed.data.clientId);
}

function revalidateCustomerPaths(clientId: string) {
  revalidatePath("/admin/klienci");
  revalidatePath(`/admin/klienci/${clientId}`);
  revalidatePath("/admin/rezerwacje/nowa");
  revalidatePath("/rezerwacja");
}
