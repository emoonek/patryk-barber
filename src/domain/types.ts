import {
  AvailabilityExceptionType,
  BookingActorType,
  BookingStatus,
  MessageChannel,
  UserRole,
} from "./enums";

export const BUSINESS_PROFILE = {
  name: "Patryk Barber",
  address: "Ul. Zwycięstwa 28, 11-710 Piecki",
  email: "spontan2wz@gmail.com",
  phone: "+48 575 088 360",
  instagram: "@patrykbarber",
  facebook: "Patryk Barber",
} as const;

export const BOOKING_SLOT_START_TIMES = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
] as const;

export const DEFAULT_SERVICE_DURATION_MINUTES = 60;
export const MAX_ACTIVE_FUTURE_BOOKINGS_PER_CUSTOMER = 3;

export const ACTIVE_BOOKING_STATUSES = [BookingStatus.Confirmed] as const;

export type BookingSlotStartTime = (typeof BOOKING_SLOT_START_TIMES)[number];

export type MoneyCents = number;

export type PublicService = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  priceCents: MoneyCents;
  durationMinutes: number;
};

export type BookingWindow = {
  startAt: Date;
  endAt: Date;
};

export type CreateBookingInput = {
  customerId: string;
  serviceId: string;
  startAt: Date;
  customerMessage?: string;
};

export type AdminCreateBookingInput = CreateBookingInput & {
  adminNote?: string;
};

export type ChangeBookingStatusInput = {
  bookingId: string;
  toStatus: BookingStatus;
  actorType: BookingActorType;
  actorUserId?: string;
  reason?: string;
};

export type AvailabilityRuleInput = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotMinutes: number;
  isActive: boolean;
};

export type AvailabilityExceptionInput = {
  type: AvailabilityExceptionType;
  startsAt: Date;
  endsAt: Date;
  reason?: string;
};

export type AuthenticatedUser = {
  id: string;
  email: string;
  role: UserRole;
  emailVerifiedAt: Date | null;
};

export type SendCustomerMessageInput = {
  customerId: string;
  channel: MessageChannel.Email;
  subject: string;
  body: string;
};
