export const BOOKING_SLOT_STARTS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"] as const;

export type BookingSlotStart = (typeof BOOKING_SLOT_STARTS)[number];

export type OpeningHours = {
  isOpen: boolean;
  firstSlotStart?: BookingSlotStart;
  lastSlotStart?: BookingSlotStart;
};

const CLOSED: OpeningHours = { isOpen: false };

const WEEKDAY_OPENING_HOURS: OpeningHours = {
  isOpen: true,
  firstSlotStart: "09:00",
  lastSlotStart: "16:00",
};

const SATURDAY_OPENING_HOURS: OpeningHours = {
  isOpen: true,
  firstSlotStart: "09:00",
  lastSlotStart: "13:00",
};

function dateForOpeningHours(date: Date | string) {
  if (date instanceof Date) {
    return date;
  }

  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function getOpeningHoursForDate(date: Date | string): OpeningHours {
  const day = dateForOpeningHours(date).getDay();

  if (day >= 1 && day <= 5) {
    return WEEKDAY_OPENING_HOURS;
  }

  if (day === 6) {
    return SATURDAY_OPENING_HOURS;
  }

  return CLOSED;
}

export function getBookableSlotStartsForDate(date: Date | string): BookingSlotStart[] {
  const openingHours = getOpeningHoursForDate(date);

  if (!openingHours.isOpen || !openingHours.firstSlotStart || !openingHours.lastSlotStart) {
    return [];
  }

  const firstIndex = BOOKING_SLOT_STARTS.indexOf(openingHours.firstSlotStart);
  const lastIndex = BOOKING_SLOT_STARTS.indexOf(openingHours.lastSlotStart);

  return BOOKING_SLOT_STARTS.slice(firstIndex, lastIndex + 1);
}

export function isBusinessDay(date: Date | string) {
  return getOpeningHoursForDate(date).isOpen;
}

export function isSlotWithinOpeningHours(date: Date | string, time: string): time is BookingSlotStart {
  return getBookableSlotStartsForDate(date).includes(time as BookingSlotStart);
}

export function assertSlotWithinOpeningHours(date: Date | string, time: string) {
  if (!isSlotWithinOpeningHours(date, time)) {
    throw new Error("Wybrany termin jest poza godzinami pracy salonu.");
  }
}
