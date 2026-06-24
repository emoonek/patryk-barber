import { BookingStatus, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import type { AdminCustomerSearch } from "./admin-customer.schemas";

export function listAdminCustomersWithStats(filters: AdminCustomerSearch, now = new Date()) {
  const query = filters.q.trim();
  const where: Prisma.UserWhereInput = {
    role: "customer",
    deletedAt: null,
  };

  if (query) {
    where.OR = [
      { firstName: { contains: query, mode: "insensitive" } },
      { lastName: { contains: query, mode: "insensitive" } },
      { email: { contains: query, mode: "insensitive" } },
      { phone: { contains: query, mode: "insensitive" } },
    ];
  }

  return prisma.user.findMany({
    where,
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }, { email: "asc" }],
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      isActive: true,
      isBlocked: true,
      blockedReason: true,
      blockedAt: true,
      blockedByAdminId: true,
      createdAt: true,
      _count: {
        select: {
          bookings: true,
        },
      },
      bookings: {
        where: {
          status: BookingStatus.confirmed,
          startAt: { gt: now },
        },
        select: { id: true },
      },
    },
  });
}

export function getAdminCustomerDetails(clientId: string, now = new Date()) {
  return prisma.user.findFirst({
    where: {
      id: clientId,
      role: "customer",
      deletedAt: null,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      isActive: true,
      isBlocked: true,
      blockedReason: true,
      blockedAt: true,
      blockedByAdminId: true,
      emailVerifiedAt: true,
      lastLoginAt: true,
      createdAt: true,
      bookings: {
        orderBy: { startAt: "desc" },
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
      },
      customerNotes: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          content: true,
          createdAt: true,
          author: {
            select: {
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
      _count: {
        select: {
          bookings: true,
        },
      },
    },
  }).then((customer) => {
    if (!customer) {
      return null;
    }

    return {
      ...customer,
      upcomingBookings: customer.bookings
        .filter((booking) => booking.status === BookingStatus.confirmed && booking.startAt > now)
        .sort((a, b) => a.startAt.getTime() - b.startAt.getTime()),
      bookingHistory: customer.bookings.filter(
        (booking) => booking.status !== BookingStatus.confirmed || booking.startAt <= now,
      ),
    };
  });
}
