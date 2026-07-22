import { BookingActorType, BookingStatus, Prisma } from "@prisma/client";
import {
  sendAdminBookingCancellationNotification,
  sendAdminNewBookingNotification,
  sendBookingCancellationEmail,
  sendBookingConfirmationEmail,
} from "@/lib/email";
import { prisma } from "@/lib/db/prisma";
import {
  addMinutes,
  dateTimeFromParts,
  dayRange,
  formatDate,
  formatMoney,
  formatSlotKey,
  formatTime,
  rangesOverlap,
  type AvailableSlot,
} from "./booking.format";
import { assertSlotWithinOpeningHours, getBookableSlotStartsForDate } from "./opening-hours";
import type { CancelBookingInput, CreateBookingInput } from "./booking.schemas";
import {
  ACTIVE_BOOKING_STATUS,
  countFutureActiveBookingsForCustomer,
  findActiveService,
  findBookableUser,
  listActiveBookingsInRange,
  listBlockedAvailabilityExceptions,
} from "./booking.repository";

const MAX_ACTIVE_FUTURE_BOOKINGS = 3;

type BookingEmailData = {
  customer: {
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
  serviceNameSnapshot: string;
  servicePriceCentsSnapshot: number;
  serviceDurationMinutesSnapshot: number;
  startAt: Date;
};

export async function getAvailableSlots(serviceId: string, date: string): Promise<AvailableSlot[]> {
  const service = await findActiveService(serviceId);

  if (!service) {
    return [];
  }

  const now = new Date();
  const range = dayRange(date);
  const [activeBookings, blockedExceptions] = await Promise.all([
    listActiveBookingsInRange(range.start, range.end),
    listBlockedAvailabilityExceptions(range.start, range.end),
  ]);
  const takenSlotKeys = new Set(activeBookings.map((booking) => booking.activeSlotKey).filter(Boolean));

  return getBookableSlotStartsForDate(date).map((time) => {
    const startAt = dateTimeFromParts(date, time);
    return {
      time,
      startAt,
      endAt: addMinutes(startAt, service.durationMinutes),
    };
  }).filter((slot) => {
    if (slot.startAt <= now) {
      return false;
    }

    if (takenSlotKeys.has(formatSlotKey(slot.startAt))) {
      return false;
    }

    return !blockedExceptions.some((exception) =>
      rangesOverlap(slot.startAt, slot.endAt, exception.startsAt, exception.endsAt),
    );
  });
}

export async function createBooking(customerId: string, input: CreateBookingInput) {
  const now = new Date();
  const startAt = dateTimeFromParts(input.date, input.time);

  assertSlotWithinOpeningHours(input.date, input.time);

  if (startAt <= now) {
    throw new Error("Nie można zarezerwować terminu w przeszłości.");
  }

  try {
    const booking = await prisma.$transaction(
      async (tx) => {
        await tx.user.update({
          where: { id: customerId },
          data: { updatedAt: now },
        });

        const [user, service, activeFutureBookings] = await Promise.all([
          findBookableUser(customerId, tx),
          findActiveService(input.serviceId, tx),
          countFutureActiveBookingsForCustomer(customerId, now, tx),
        ]);

        if (!user) {
          throw new Error("Konto jest nieaktywne.");
        }

        if (user.isBlocked) {
          throw new Error(
            user.blockedReason
              ? `Twoje konto jest zablokowane. Powód: ${user.blockedReason}`
              : "Twoje konto jest zablokowane. Nie możesz tworzyć nowych rezerwacji.",
          );
        }

        if (!user.emailVerifiedAt) {
          throw new Error("Aby zarezerwować wizytę, najpierw potwierdź adres email.");
        }

        if (!service) {
          throw new Error("Wybrana usługa jest niedostępna.");
        }

        if (activeFutureBookings >= MAX_ACTIVE_FUTURE_BOOKINGS) {
          throw new Error("Możesz mieć maksymalnie 3 aktywne przyszłe rezerwacje.");
        }

        const endAt = addMinutes(startAt, service.durationMinutes);
        const blockedException = await tx.availabilityException.findFirst({
          where: {
            type: "blocked",
            startsAt: { lt: endAt },
            endsAt: { gt: startAt },
          },
          select: { id: true },
        });

        if (blockedException) {
          throw new Error("Ten termin jest zablokowany.");
        }

        return tx.booking.create({
          data: {
            customerId,
            serviceId: service.id,
            serviceNameSnapshot: service.name,
            servicePriceCentsSnapshot: service.priceCents,
            serviceDurationMinutesSnapshot: service.durationMinutes,
            status: ACTIVE_BOOKING_STATUS,
            activeSlotKey: formatSlotKey(startAt),
            startAt,
            endAt,
            statusHistory: {
              create: {
                fromStatus: null,
                toStatus: ACTIVE_BOOKING_STATUS,
                actorType: BookingActorType.customer,
                actorUserId: customerId,
                reason: "Rezerwacja utworzona przez klienta.",
              },
            },
          },
          select: bookingEmailSelect,
        });
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );

    await logBookingEmailFailures("utworzeniu rezerwacji", [
      sendBookingConfirmationEmail(toBookingEmailContext(booking)),
      sendAdminNewBookingNotification(toBookingEmailContext(booking)),
    ]);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new Error("Ten termin jest już zajęty.");
    }

    throw error;
  }
}

export async function cancelCustomerBooking(customerId: string, input: CancelBookingInput) {
  const now = new Date();

  const booking = await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findFirst({
      where: {
        id: input.bookingId,
        customerId,
      },
      select: {
        id: true,
        status: true,
        startAt: true,
        endAt: true,
        serviceNameSnapshot: true,
        servicePriceCentsSnapshot: true,
        serviceDurationMinutesSnapshot: true,
        customer: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!booking) {
      throw new Error("Nie znaleziono rezerwacji.");
    }

    if (booking.status !== BookingStatus.confirmed) {
      throw new Error("Tę rezerwację już zamknięto.");
    }

    if (booking.startAt <= now) {
      throw new Error("Możesz anulować tylko przyszłą rezerwację.");
    }

    return tx.booking.update({
      where: { id: booking.id },
      data: {
        status: BookingStatus.cancelled_by_client,
        activeSlotKey: null,
        cancelledAt: now,
        statusHistory: {
          create: {
            fromStatus: booking.status,
            toStatus: BookingStatus.cancelled_by_client,
            actorType: BookingActorType.customer,
            actorUserId: customerId,
            reason: "Rezerwacja anulowana przez klienta.",
          },
        },
      },
      select: bookingEmailSelect,
    });
  });

  await logBookingEmailFailures("anulowaniu rezerwacji przez klienta", [
    sendBookingCancellationEmail(toBookingEmailContext(booking)),
    sendAdminBookingCancellationNotification(toBookingEmailContext(booking)),
  ]);
}

function customerFullName(customer: BookingEmailData["customer"]) {
  return `${customer.firstName ?? ""} ${customer.lastName ?? ""}`.trim() || customer.email;
}

function toBookingEmailContext(booking: BookingEmailData) {
  return {
    customerEmail: booking.customer.email,
    customerName: customerFullName(booking.customer),
    serviceName: booking.serviceNameSnapshot,
    servicePrice: formatMoney(booking.servicePriceCentsSnapshot),
    serviceDurationMinutes: booking.serviceDurationMinutesSnapshot,
    date: formatDate(booking.startAt),
    time: formatTime(booking.startAt),
  };
}

async function logBookingEmailFailures(context: string, emailPromises: Promise<unknown>[]) {
  const results = await Promise.allSettled(emailPromises);

  results.forEach((result) => {
    if (result.status === "rejected") {
      console.error(`[EMAIL] Blad wysylki po ${context}.`, result.reason);
    }
  });
}

const bookingEmailSelect = {
  customer: {
    select: {
      email: true,
      firstName: true,
      lastName: true,
    },
  },
  serviceNameSnapshot: true,
  servicePriceCentsSnapshot: true,
  serviceDurationMinutesSnapshot: true,
  startAt: true,
} satisfies Prisma.BookingSelect;
