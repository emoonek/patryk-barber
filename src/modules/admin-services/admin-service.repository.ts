import { prisma } from "@/lib/db/prisma";

export function listAdminServices() {
  return prisma.service.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      priceCents: true,
      durationMinutes: true,
      isActive: true,
      sortOrder: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          bookings: true,
        },
      },
    },
  });
}

export function getAdminService(serviceId: string) {
  return prisma.service.findUnique({
    where: { id: serviceId },
    select: {
      id: true,
      name: true,
      priceCents: true,
      durationMinutes: true,
      isActive: true,
      sortOrder: true,
    },
  });
}
