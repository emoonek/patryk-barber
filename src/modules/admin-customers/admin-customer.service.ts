import { prisma } from "@/lib/db/prisma";
import type {
  AdminBlockCustomerInput,
  AdminCreateCustomerNoteInput,
  AdminDeleteCustomerNoteInput,
  AdminUpdateCustomerInput,
} from "./admin-customer.schemas";

function normalizeOptionalReason(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "Klient zablokowany przez admina.";
}

async function assertCustomerExists(clientId: string) {
  const customer = await prisma.user.findFirst({
    where: {
      id: clientId,
      role: "customer",
      deletedAt: null,
    },
    select: { id: true },
  });

  if (!customer) {
    throw new Error("Nie znaleziono klienta.");
  }

  return customer;
}

export async function updateAdminCustomer(input: AdminUpdateCustomerInput) {
  await assertCustomerExists(input.clientId);

  await prisma.user.update({
    where: { id: input.clientId },
    data: {
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
    },
  });
}

export async function blockAdminCustomer(adminUserId: string, input: AdminBlockCustomerInput) {
  await assertCustomerExists(input.clientId);
  const blockedReason = normalizeOptionalReason(input.reason);
  const blockedAt = new Date();

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: input.clientId },
      data: {
        isBlocked: true,
        blockedReason,
        blockedAt,
        blockedByAdminId: adminUserId,
      },
    });

    await tx.customerNote.create({
      data: {
        customerId: input.clientId,
        authorId: adminUserId,
        content: `Blokada konta: ${blockedReason}`,
      },
    });
  });
}

export async function unblockAdminCustomer(clientId: string) {
  await assertCustomerExists(clientId);

  await prisma.user.update({
    where: { id: clientId },
    data: {
      isBlocked: false,
      blockedReason: null,
      blockedAt: null,
      blockedByAdminId: null,
    },
  });
}

export async function createAdminCustomerNote(adminUserId: string, input: AdminCreateCustomerNoteInput) {
  await assertCustomerExists(input.clientId);

  await prisma.customerNote.create({
    data: {
      customerId: input.clientId,
      authorId: adminUserId,
      content: input.content,
    },
  });
}

export async function deleteAdminCustomerNote(input: AdminDeleteCustomerNoteInput) {
  await assertCustomerExists(input.clientId);

  await prisma.customerNote.deleteMany({
    where: {
      id: input.noteId,
      customerId: input.clientId,
    },
  });
}
