import {
  AvailabilityExceptionType,
  BookingActorType,
  BookingStatus,
  MessageChannel,
  UserRole,
} from "./enums";

export const BUSINESS_PROFILE = {
  name: process.env.NEXT_PUBLIC_BUSINESS_NAME ?? "Patryk Barber",
  address: process.env.NEXT_PUBLIC_BUSINESS_ADDRESS ?? "ul. Zwycięstwa 28/4, 11-710 Piecki",
  email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL ?? "spontan2wz@gmail.com",
  phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE ?? "513296426",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE ?? "@patrykbarber",
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_NAME ?? "Facebook",
  instagramUrl:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ??
    "https://www.instagram.com/patrykbarber?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
  facebookUrl: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "https://www.facebook.com/share/1aHRhwbUhK/?mibextid=wwXIfr",
  googleMapsUrl: process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL ?? "https://maps.app.goo.gl/HEG3UCfGwXtCRJk58",
  openingHours: [
    "Poniedziałek-piątek: 9:00-17:00",
    "Sobota: 9:00-14:00",
    "Niedziela: nieczynne",
  ],
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
