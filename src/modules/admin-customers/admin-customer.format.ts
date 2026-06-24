import { BookingStatus, UserRole } from "@prisma/client";

export function customerDisplayName(customer: {
  firstName: string | null;
  lastName: string | null;
  email: string;
}) {
  const name = [customer.firstName, customer.lastName].filter(Boolean).join(" ").trim();
  return name || customer.email;
}

export function roleLabel(role: UserRole) {
  return role === UserRole.admin ? "admin" : "klient";
}

export function activityLabel(status: { isActive: boolean; isBlocked: boolean }) {
  if (!status.isActive) {
    return "konto nieaktywne";
  }

  return status.isBlocked ? "zablokowany" : "aktywny";
}

export function emailVerificationLabel(emailVerifiedAt: Date | null) {
  return emailVerifiedAt ? "zweryfikowany" : "niezweryfikowany";
}

export function bookingStatusLabel(status: BookingStatus) {
  switch (status) {
    case BookingStatus.confirmed:
      return "potwierdzona";
    case BookingStatus.cancelled_by_client:
      return "anulowana przez klienta";
    case BookingStatus.cancelled_by_admin:
      return "anulowana przez admina";
    case BookingStatus.completed:
      return "zakonczona";
    case BookingStatus.no_show:
      return "no-show";
    default:
      return status;
  }
}
