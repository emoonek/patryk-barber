import { BookingStatus, AvailabilityExceptionType, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

export const ACTIVE_BOOKING_STATUS = BookingStatus.confirmed;

export function listActiveServices() {
  return prisma.service.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      priceCents: true,
      durationMinutes: true,
    },
  });
}

export function findActiveService(serviceId: string, tx: Prisma.TransactionClient = prisma) {
  return tx.service.findFirst({
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
}

export function findBookableUser(userId: string, tx: Prisma.TransactionClient = prisma) {
  return tx.user.findFirst({
    where: {
      id: userId,
      deletedAt: null,
      isActive: true,
    },
    select: {
      id: true,
      emailVerifiedAt: true,
      isBlocked: true,
      blockedReason: true,
    },
  });
}

export function listActiveBookingsInRange(startsAt: Date, endsAt: Date) {
  return prisma.booking.findMany({
    where: {
      status: ACTIVE_BOOKING_STATUS,
      startAt: {
        lt: endsAt,
      },
      endAt: {
        gt: startsAt,
      },
      activeSlotKey: {
        not: null,
      },
    },
    select: {
      activeSlotKey: true,
      startAt: true,
    },
  });
}

export function listBlockedAvailabilityExceptions(startsAt: Date, endsAt: Date) {
  return prisma.availabilityException.findMany({
    where: {
      type: AvailabilityExceptionType.blocked,
      startsAt: {
        lt: endsAt,
      },
      endsAt: {
        gt: startsAt,
      },
    },
    select: {
      startsAt: true,
      endsAt: true,
    },
  });
}

export function countFutureActiveBookingsForCustomer(customerId: string, now: Date, tx: Prisma.TransactionClient) {
  return tx.booking.count({
    where: {
      customerId,
      status: ACTIVE_BOOKING_STATUS,
      startAt: {
        gte: now,
      },
      activeSlotKey: {
        not: null,
      },
    },
  });
}

export function listCustomerBookings(customerId: string) {
  return prisma.booking.findMany({
    where: {
      customerId,
    },
    orderBy: {
      startAt: "asc",
    },
    select: {
      id: true,
      status: true,
      startAt: true,
      endAt: true,
      service: {
        select: {
          name: true,
          priceCents: true,
        },
      },
    },
  });
}
