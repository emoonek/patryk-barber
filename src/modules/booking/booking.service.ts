import { BookingActorType, BookingStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import type { CancelBookingInput, CreateBookingInput } from "./booking.schemas";
import {
  ACTIVE_BOOKING_STATUS,
  countFutureActiveBookingsForCustomer,
  findActiveService,
  findBookableUser,
  listActiveBookingsInRange,
  listBlockedAvailabilityExceptions,
} from "./booking.repository";

export const DEFAULT_SLOT_TIMES = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"] as const;

const MAX_ACTIVE_FUTURE_BOOKINGS = 3;

export type AvailableSlot = {
  time: (typeof DEFAULT_SLOT_TIMES)[number];
  startAt: Date;
  endAt: Date;
};

export function dateTimeFromParts(date: string, time: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hours, minutes] = time.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

export function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60_000);
}

export function dayRange(date: string) {
  const start = dateTimeFromParts(date, "00:00");
  const end = addMinutes(start, 24 * 60);
  return { start, end };
}

export function rangesOverlap(firstStart: Date, firstEnd: Date, secondStart: Date, secondEnd: Date) {
  return firstStart < secondEnd && firstEnd > secondStart;
}

export function formatSlotKey(startAt: Date) {
  return `slot:${startAt.toISOString()}`;
}

export function formatMoney(priceCents: number) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(priceCents / 100);
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "medium",
  }).format(date);
}

export function formatTime(date: Date) {
  return new Intl.DateTimeFormat("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function todayInputValue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

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

  return DEFAULT_SLOT_TIMES.map((time) => {
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

  if (startAt <= now) {
    throw new Error("Nie można zarezerwować terminu w przeszłości.");
  }

  try {
    await prisma.$transaction(
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
              ? `Twoje konto jest zablokowane. Powod: ${user.blockedReason}`
              : "Twoje konto jest zablokowane. Nie mozesz tworzyc nowych rezerwacji.",
          );
        }

        if (!user.emailVerifiedAt) {
          throw new Error("Najpierw zweryfikuj adres email.");
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

        await tx.booking.create({
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
        });
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new Error("Ten termin jest już zajęty.");
    }

    throw error;
  }
}

export async function cancelCustomerBooking(customerId: string, input: CancelBookingInput) {
  const now = new Date();

  await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findFirst({
      where: {
        id: input.bookingId,
        customerId,
      },
      select: {
        id: true,
        status: true,
        startAt: true,
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

    await tx.booking.update({
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
    });
  });
}
