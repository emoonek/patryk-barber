export enum UserRole {
  Customer = "customer",
  Admin = "admin",
}

export enum BookingStatus {
  Confirmed = "confirmed",
  CancelledByClient = "cancelled_by_client",
  CancelledByAdmin = "cancelled_by_admin",
  Completed = "completed",
  NoShow = "no_show",
}

export enum BookingActorType {
  Customer = "customer",
  Admin = "admin",
  System = "system",
}

export enum AvailabilityExceptionType {
  Blocked = "blocked",
  ExtraOpen = "extra_open",
}

export enum MessageChannel {
  Email = "email",
}
