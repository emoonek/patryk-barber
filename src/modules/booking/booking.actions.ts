"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assertRateLimit, RateLimitError, requestRateLimitKey } from "@/lib/security/rate-limit";
import { requireAuth } from "@/modules/auth/auth.guards";
import { cancelBookingSchema, createBookingSchema } from "./booking.schemas";
import { cancelCustomerBooking, createBooking } from "./booking.service";

export type BookingActionState = {
  ok?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

function validationError(errors: Record<string, string[] | undefined>): BookingActionState {
  return {
    ok: false,
    message: "Popraw błędy w formularzu.",
    errors: Object.fromEntries(
      Object.entries(errors).filter((entry): entry is [string, string[]] => Boolean(entry[1]?.length)),
    ),
  };
}

function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function actionError(error: unknown, fallback: string): BookingActionState {
  return {
    ok: false,
    message: error instanceof RateLimitError || error instanceof Error ? error.message : fallback,
  };
}

export async function createBookingAction(
  _state: BookingActionState,
  formData: FormData,
): Promise<BookingActionState> {
  const user = await requireAuth();

  try {
    assertRateLimit({
      key: await requestRateLimitKey("booking:create", user.id),
      limit: 6,
      windowMs: 10 * 60 * 1000,
    });
  } catch (error) {
    return actionError(error, "Nie udało się utworzyć rezerwacji.");
  }

  const parsed = createBookingSchema.safeParse({
    serviceId: formValue(formData, "serviceId"),
    date: formValue(formData, "date"),
    time: formValue(formData, "time"),
  });

  if (!parsed.success) {
    return validationError(parsed.error.flatten().fieldErrors);
  }

  try {
    await createBooking(user.id, parsed.data);
  } catch (error) {
    return actionError(error, "Nie udało się utworzyć rezerwacji.");
  }

  revalidatePath("/rezerwacja");
  revalidatePath("/konto");

  return {
    ok: true,
    message: "Rezerwacja została potwierdzona.",
  };
}

export async function cancelBookingAction(formData: FormData) {
  const user = await requireAuth();
  const parsed = cancelBookingSchema.safeParse({
    bookingId: formValue(formData, "bookingId"),
  });

  if (!parsed.success) {
    redirect("/konto");
  }

  await cancelCustomerBooking(user.id, parsed.data);

  revalidatePath("/konto");
  revalidatePath("/rezerwacja");
}
