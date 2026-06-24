import { BookingStatus, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { dayRange } from "@/modules/booking/booking.service";
import type { AdminBookingFilters } from "./admin-booking.schemas";

export function listAdminServices() {
  return prisma.service.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      priceCents: true,
      durationMinutes: true,
    },
  });
}

export function listAdminCustomers() {
  return prisma.user.findMany({
    where: {
      role: "customer",
      deletedAt: null,
      isActive: true,
      isBlocked: false,
    },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }, { email: "asc" }],
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
    },
  });
}

export async function getAdminDashboardStats(now = new Date()) {
  const today = dayRange(toInputDate(now));

  const [todayBookingsCount, futureBookingsCount, upcomingBookings] = await Promise.all([
    prisma.booking.count({
      where: {
        startAt: {
          gte: today.start,
          lt: today.end,
        },
      },
    }),
    prisma.booking.count({
      where: {
        status: BookingStatus.confirmed,
        startAt: {
          gt: now,
        },
      },
    }),
    prisma.booking.findMany({
      where: {
        status: BookingStatus.confirmed,
        startAt: {
          gt: now,
        },
      },
      orderBy: { startAt: "asc" },
      take: 5,
      select: adminBookingListSelect,
    }),
  ]);

  return {
    todayBookingsCount,
    futureBookingsCount,
    upcomingBookings,
  };
}

export function listAdminBookings(filters: AdminBookingFilters) {
  const where: Prisma.BookingWhereInput = {};

  if (filters.date) {
    const range = dayRange(filters.date);
    where.startAt = {
      gte: range.start,
      lt: range.end,
    };
  }

  if (filters.status !== "all") {
    where.status = filters.status;
  }

  return prisma.booking.findMany({
    where,
    orderBy: { startAt: "desc" },
    select: adminBookingListSelect,
  });
}

export function getAdminBookingDetails(bookingId: string) {
  return prisma.booking.findUnique({
    where: { id: bookingId },
    select: {
      id: true,
      status: true,
      activeSlotKey: true,
      startAt: true,
      endAt: true,
      customerMessage: true,
      adminNote: true,
      cancelledAt: true,
      completedAt: true,
      noShowAt: true,
      createdAt: true,
      customer: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
        },
      },
      service: {
        select: {
          id: true,
          name: true,
          priceCents: true,
          durationMinutes: true,
        },
      },
      statusHistory: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          fromStatus: true,
          toStatus: true,
          actorType: true,
          reason: true,
          createdAt: true,
          actorUser: {
            select: {
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });
}

export function listAvailabilityExceptions() {
  return prisma.availabilityException.findMany({
    orderBy: { startsAt: "asc" },
    select: {
      id: true,
      type: true,
      startsAt: true,
      endsAt: true,
      reason: true,
      createdAt: true,
    },
  });
}

export function toInputDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const adminBookingListSelect = {
  id: true,
  status: true,
  startAt: true,
  endAt: true,
  customer: {
    select: {
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
    },
  },
  service: {
    select: {
      name: true,
      priceCents: true,
    },
  },
} satisfies Prisma.BookingSelect;
