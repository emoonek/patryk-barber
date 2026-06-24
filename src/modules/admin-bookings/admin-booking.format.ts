import { BookingActorType, BookingStatus } from "@prisma/client";

export function adminStatusLabel(status: BookingStatus) {
  const labels: Record<BookingStatus, string> = {
    confirmed: "potwierdzona",
    cancelled_by_client: "anulowana przez klienta",
    cancelled_by_admin: "anulowana przez admina",
    completed: "zakonczona",
    no_show: "no-show",
  };

  return labels[status];
}

export function actorTypeLabel(actorType: BookingActorType) {
  const labels: Record<BookingActorType, string> = {
    customer: "klient",
    admin: "admin",
    system: "system",
  };

  return labels[actorType];
}

export function customerName(customer: { firstName: string | null; lastName: string | null; email: string }) {
  const name = [customer.firstName, customer.lastName].filter(Boolean).join(" ");
  return name || customer.email;
}

export function inputDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function inputTimeValue(date: Date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}
