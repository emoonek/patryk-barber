import { AvailabilityExceptionType, BookingActorType, BookingStatus, Prisma } from "@prisma/client";
import { sendAdminMessageToCustomer, sendBookingCancellationEmail } from "@/lib/email";
import { prisma } from "@/lib/db/prisma";
import {
  addMinutes,
  dateTimeFromParts,
  dayRange,
  formatDate,
  formatMoney,
  formatSlotKey,
  formatTime,
} from "@/modules/booking/booking.format";
import type {
  AdminCancelBookingInput,
  AdminCreateBookingInput,
  AdminMessageToCustomerInput,
  AdminStatusChangeInput,
  AdminUpdateBookingInput,
  BlockFullDayInput,
  BlockSlotInput,
} from "./admin-booking.schemas";

function normalizeOptionalText(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

async function findServiceOrThrow(serviceId: string, tx: Prisma.TransactionClient) {
  const service = await tx.service.findFirst({
    where: {
      id: serviceId,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      priceCents: true,
      durationMinutes: true,
    },
  });

  if (!service) {
    throw new Error("Wybrana usluga jest niedostepna.");
  }

  return service;
}

async function assertSlotIsFree(
  startAt: Date,
  endAt: Date,
  tx: Prisma.TransactionClient,
  ignoredBookingId?: string,
) {
  const blockedException = await tx.availabilityException.findFirst({
    where: {
      type: AvailabilityExceptionType.blocked,
      startsAt: { lt: endAt },
      endsAt: { gt: startAt },
    },
    select: { id: true },
  });

  if (blockedException) {
    throw new Error("Ten termin jest zablokowany.");
  }

  const conflictingBooking = await tx.booking.findFirst({
    where: {
      id: ignoredBookingId ? { not: ignoredBookingId } : undefined,
      status: BookingStatus.confirmed,
      OR: [
        { activeSlotKey: formatSlotKey(startAt) },
        {
          startAt: { lt: endAt },
          endAt: { gt: startAt },
          activeSlotKey: { not: null },
        },
      ],
    },
    select: { id: true },
  });

  if (conflictingBooking) {
    throw new Error("Ten termin jest juz zajety.");
  }
}

export async function adminCreateBooking(adminUserId: string, input: AdminCreateBookingInput) {
  const now = new Date();
  const startAt = dateTimeFromParts(input.date, input.time);

  if (startAt <= now) {
    throw new Error("Nie mozna utworzyc rezerwacji w przeszlosci.");
  }

  try {
    await prisma.$transaction(
      async (tx) => {
        const [customer, service] = await Promise.all([
          tx.user.findFirst({
            where: {
              id: input.customerId,
              role: "customer",
              deletedAt: null,
              isActive: true,
              isBlocked: false,
            },
            select: { id: true },
          }),
          findServiceOrThrow(input.serviceId, tx),
        ]);

        if (!customer) {
          throw new Error("Wybrany klient nie istnieje, jest nieaktywny albo zablokowany.");
        }

        const endAt = addMinutes(startAt, service.durationMinutes);
        await assertSlotIsFree(startAt, endAt, tx);

        await tx.booking.create({
          data: {
            customerId: customer.id,
            serviceId: service.id,
            serviceNameSnapshot: service.name,
            servicePriceCentsSnapshot: service.priceCents,
            serviceDurationMinutesSnapshot: service.durationMinutes,
            status: BookingStatus.confirmed,
            activeSlotKey: formatSlotKey(startAt),
            startAt,
            endAt,
            statusHistory: {
              create: {
                fromStatus: null,
                toStatus: BookingStatus.confirmed,
                actorType: BookingActorType.admin,
                actorUserId: adminUserId,
                reason: "Rezerwacja utworzona przez admina.",
              },
            },
          },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
  } catch (error) {
    handleUniqueSlotError(error);
  }
}

export async function adminUpdateBooking(adminUserId: string, input: AdminUpdateBookingInput) {
  const startAt = dateTimeFromParts(input.date, input.time);

  try {
    await prisma.$transaction(
      async (tx) => {
        const booking = await tx.booking.findUnique({
          where: { id: input.bookingId },
          select: {
            id: true,
            status: true,
            serviceId: true,
            startAt: true,
          },
        });

        if (!booking) {
          throw new Error("Nie znaleziono rezerwacji.");
        }

        const service = await findServiceOrThrow(input.serviceId, tx);
        const endAt = addMinutes(startAt, service.durationMinutes);
        const remainsConfirmed = booking.status === BookingStatus.confirmed;
        const serviceChanged = booking.serviceId !== service.id;

        if (remainsConfirmed) {
          await assertSlotIsFree(startAt, endAt, tx, booking.id);
        }

        await tx.booking.update({
          where: { id: booking.id },
          data: {
            serviceId: service.id,
            ...(serviceChanged
              ? {
                  serviceNameSnapshot: service.name,
                  servicePriceCentsSnapshot: service.priceCents,
                  serviceDurationMinutesSnapshot: service.durationMinutes,
                }
              : {}),
            startAt,
            endAt,
            activeSlotKey: remainsConfirmed ? formatSlotKey(startAt) : null,
            statusHistory: {
              create: {
                fromStatus: booking.status,
                toStatus: booking.status,
                actorType: BookingActorType.admin,
                actorUserId: adminUserId,
                reason: "Admin zmienil termin lub usluge rezerwacji.",
              },
            },
          },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
  } catch (error) {
    handleUniqueSlotError(error);
  }
}

export async function adminCancelBooking(adminUserId: string, input: AdminCancelBookingInput) {
  const reason = normalizeOptionalText(input.cancelReason) ?? "Rezerwacja anulowana przez admina.";
  const booking = await adminChangeBookingStatus(adminUserId, {
    bookingId: input.bookingId,
    status: BookingStatus.cancelled_by_admin,
    reason,
  });

  await logAdminBookingEmailFailures("anulowaniu rezerwacji przez admina", [
    sendBookingCancellationEmail({
      ...toAdminBookingEmailContext(booking),
      cancelReason: normalizeOptionalText(input.cancelReason),
    }),
  ]);
}

export async function adminMarkBookingStatus(adminUserId: string, input: AdminStatusChangeInput) {
  await adminChangeBookingStatus(adminUserId, {
    bookingId: input.bookingId,
    status: input.status,
    reason: input.status === BookingStatus.completed ? "Wizyta oznaczona jako zakonczona." : "Wizyta oznaczona jako no-show.",
  });
}

export async function adminSendMessageToCustomer(_adminUserId: string, input: AdminMessageToCustomerInput) {
  const booking = await prisma.booking.findUnique({
    where: { id: input.bookingId },
    select: adminBookingEmailSelect,
  });

  if (!booking) {
    throw new Error("Nie znaleziono rezerwacji.");
  }

  await sendAdminMessageToCustomer({
    ...toAdminBookingEmailContext(booking),
    subject: input.subject,
    message: input.message,
  });
}

async function adminChangeBookingStatus(
  adminUserId: string,
  input: { bookingId: string; status: BookingStatus; reason: string },
) {
  const now = new Date();

  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: input.bookingId },
      select: {
        id: true,
        status: true,
      },
    });

    if (!booking) {
      throw new Error("Nie znaleziono rezerwacji.");
    }

    if (booking.status === input.status) {
      throw new Error("Rezerwacja ma juz ten status.");
    }

    if (booking.status !== BookingStatus.confirmed) {
      throw new Error("Tylko potwierdzona rezerwacja moze zmienic status przez akcje admina.");
    }

    return tx.booking.update({
      where: { id: booking.id },
      data: {
        status: input.status,
        activeSlotKey: null,
        cancelledAt: input.status === BookingStatus.cancelled_by_admin ? now : undefined,
        completedAt: input.status === BookingStatus.completed ? now : undefined,
        noShowAt: input.status === BookingStatus.no_show ? now : undefined,
        statusHistory: {
          create: {
            fromStatus: booking.status,
            toStatus: input.status,
            actorType: BookingActorType.admin,
            actorUserId: adminUserId,
            reason: input.reason,
          },
        },
      },
      select: adminBookingEmailSelect,
    });
  });
}

export async function blockFullDay(input: BlockFullDayInput) {
  const range = dayRange(input.date);

  await prisma.availabilityException.create({
    data: {
      type: AvailabilityExceptionType.blocked,
      startsAt: range.start,
      endsAt: range.end,
      reason: normalizeOptionalText(input.reason) ?? "Dzien zablokowany przez admina.",
    },
  });
}

export async function blockSingleSlot(input: BlockSlotInput) {
  const service = await prisma.service.findFirst({
    where: {
      id: input.serviceId,
      isActive: true,
    },
    select: {
      durationMinutes: true,
    },
  });

  if (!service) {
    throw new Error("Wybrana usluga jest niedostepna.");
  }

  const startsAt = dateTimeFromParts(input.date, input.time);
  const endsAt = addMinutes(startsAt, service.durationMinutes);

  await prisma.availabilityException.create({
    data: {
      type: AvailabilityExceptionType.blocked,
      startsAt,
      endsAt,
      reason: normalizeOptionalText(input.reason) ?? "Slot zablokowany przez admina.",
    },
  });
}

export async function deleteAvailabilityException(exceptionId: string) {
  await prisma.availabilityException.delete({
    where: { id: exceptionId },
  });
}

function handleUniqueSlotError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    throw new Error("Ten termin jest juz zajety.");
  }

  throw error;
}

function customerFullName(customer: { email: string; firstName: string | null; lastName: string | null }) {
  return `${customer.firstName ?? ""} ${customer.lastName ?? ""}`.trim() || customer.email;
}

function toAdminBookingEmailContext(booking: AdminBookingEmailData) {
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

async function logAdminBookingEmailFailures(context: string, emailPromises: Promise<unknown>[]) {
  const results = await Promise.allSettled(emailPromises);

  results.forEach((result) => {
    if (result.status === "rejected") {
      console.error(`[EMAIL] Blad wysylki po ${context}.`, result.reason);
    }
  });
}

const adminBookingEmailSelect = {
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

type AdminBookingEmailData = {
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
