"use server";

import { revalidatePath } from "next/cache";
import { isEmailError } from "@/lib/email";
import { requireAdmin } from "@/modules/auth/auth.guards";
import {
  adminCancelBooking,
  adminCreateBooking,
  adminMarkBookingStatus,
  adminSendMessageToCustomer,
  adminUpdateBooking,
  blockFullDay,
  blockSingleSlot,
  deleteAvailabilityException,
} from "./admin-booking.service";
import {
  adminCancelBookingSchema,
  adminCreateBookingSchema,
  adminMessageToCustomerSchema,
  adminStatusChangeSchema,
  adminUpdateBookingSchema,
  availabilityExceptionIdSchema,
  blockFullDaySchema,
  blockSlotSchema,
} from "./admin-booking.schemas";

export type AdminActionState = {
  ok?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function validationError(errors: Record<string, string[] | undefined>): AdminActionState {
  return {
    ok: false,
    message: "Popraw bledy w formularzu.",
    errors: Object.fromEntries(
      Object.entries(errors).filter((entry): entry is [string, string[]] => Boolean(entry[1]?.length)),
    ),
  };
}

function failure(error: unknown, fallback: string): AdminActionState {
  if (isEmailError(error)) {
    return {
      ok: false,
      message: fallback,
    };
  }

  return {
    ok: false,
    message: error instanceof Error ? error.message : fallback,
  };
}

export async function adminUpdateBookingAction(
  _state: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const admin = await requireAdmin();
  const parsed = adminUpdateBookingSchema.safeParse({
    bookingId: formValue(formData, "bookingId"),
    serviceId: formValue(formData, "serviceId"),
    date: formValue(formData, "date"),
    time: formValue(formData, "time"),
  });

  if (!parsed.success) {
    return validationError(parsed.error.flatten().fieldErrors);
  }

  try {
    await adminUpdateBooking(admin.id, parsed.data);
  } catch (error) {
    return failure(error, "Nie udalo sie zaktualizowac rezerwacji.");
  }

  revalidateAdminBookingPaths(parsed.data.bookingId);
  return { ok: true, message: "Rezerwacja zostala zaktualizowana." };
}

export async function adminCreateBookingAction(
  _state: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const admin = await requireAdmin();
  const parsed = adminCreateBookingSchema.safeParse({
    customerId: formValue(formData, "customerId"),
    serviceId: formValue(formData, "serviceId"),
    date: formValue(formData, "date"),
    time: formValue(formData, "time"),
  });

  if (!parsed.success) {
    return validationError(parsed.error.flatten().fieldErrors);
  }

  try {
    await adminCreateBooking(admin.id, parsed.data);
  } catch (error) {
    return failure(error, "Nie udalo sie utworzyc rezerwacji.");
  }

  revalidatePath("/admin");
  revalidatePath("/admin/rezerwacje");
  revalidatePath("/rezerwacja");
  return { ok: true, message: "Rezerwacja zostala utworzona." };
}

export async function adminCancelBookingAction(
  _state: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const admin = await requireAdmin();
  const parsed = adminCancelBookingSchema.safeParse({
    bookingId: formValue(formData, "bookingId"),
    cancelReason: formValue(formData, "cancelReason"),
  });

  if (!parsed.success) {
    return validationError(parsed.error.flatten().fieldErrors);
  }

  try {
    await adminCancelBooking(admin.id, parsed.data);
  } catch (error) {
    return failure(error, "Nie udalo sie anulowac rezerwacji.");
  }

  revalidateAdminBookingPaths(parsed.data.bookingId);
  return { ok: true, message: "Rezerwacja zostala anulowana." };
}

export async function adminStatusChangeAction(
  _state: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const admin = await requireAdmin();
  const parsed = adminStatusChangeSchema.safeParse({
    bookingId: formValue(formData, "bookingId"),
    status: formValue(formData, "status"),
  });

  if (!parsed.success) {
    return validationError(parsed.error.flatten().fieldErrors);
  }

  try {
    await adminMarkBookingStatus(admin.id, parsed.data);
  } catch (error) {
    return failure(error, "Nie udalo sie zmienic statusu rezerwacji.");
  }

  revalidateAdminBookingPaths(parsed.data.bookingId);
  return { ok: true, message: "Status rezerwacji zostal zmieniony." };
}

export async function adminMessageToCustomerAction(
  _state: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const admin = await requireAdmin();
  const parsed = adminMessageToCustomerSchema.safeParse({
    bookingId: formValue(formData, "bookingId"),
    subject: formValue(formData, "subject"),
    message: formValue(formData, "message"),
  });

  if (!parsed.success) {
    return validationError(parsed.error.flatten().fieldErrors);
  }

  try {
    await adminSendMessageToCustomer(admin.id, parsed.data);
  } catch (error) {
    return failure(error, "Nie udalo sie wyslac wiadomosci do klienta.");
  }

  revalidateAdminBookingPaths(parsed.data.bookingId);
  return { ok: true, message: "Wiadomosc zostala wyslana do klienta." };
}

export async function blockFullDayAction(_state: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await requireAdmin();
  const parsed = blockFullDaySchema.safeParse({
    date: formValue(formData, "date"),
    reason: formValue(formData, "reason"),
  });

  if (!parsed.success) {
    return validationError(parsed.error.flatten().fieldErrors);
  }

  try {
    await blockFullDay(parsed.data);
  } catch (error) {
    return failure(error, "Nie udalo sie zablokowac dnia.");
  }

  revalidateAvailabilityPaths();
  return { ok: true, message: "Dzien zostal zablokowany." };
}

export async function blockSingleSlotAction(_state: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await requireAdmin();
  const parsed = blockSlotSchema.safeParse({
    date: formValue(formData, "date"),
    time: formValue(formData, "time"),
    serviceId: formValue(formData, "serviceId"),
    reason: formValue(formData, "reason"),
  });

  if (!parsed.success) {
    return validationError(parsed.error.flatten().fieldErrors);
  }

  try {
    await blockSingleSlot(parsed.data);
  } catch (error) {
    return failure(error, "Nie udalo sie zablokowac slotu.");
  }

  revalidateAvailabilityPaths();
  return { ok: true, message: "Slot zostal zablokowany." };
}

export async function deleteAvailabilityExceptionAction(formData: FormData) {
  await requireAdmin();
  const parsed = availabilityExceptionIdSchema.safeParse({
    exceptionId: formValue(formData, "exceptionId"),
  });

  if (!parsed.success) {
    return;
  }

  await deleteAvailabilityException(parsed.data.exceptionId);
  revalidateAvailabilityPaths();
}

function revalidateAdminBookingPaths(bookingId: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/rezerwacje");
  revalidatePath(`/admin/rezerwacje/${bookingId}`);
  revalidatePath("/konto");
  revalidatePath("/rezerwacja");
}

function revalidateAvailabilityPaths() {
  revalidatePath("/admin/dostepnosc");
  revalidatePath("/rezerwacja");
}
