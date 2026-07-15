export const DEFAULT_SLOT_TIMES = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"] as const;

export type AvailableSlot = {
  time: (typeof DEFAULT_SLOT_TIMES)[number];
  startAt: Date;
  endAt: Date;
};

export function dateTimeFromParts(date: string, time: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hours, minutes] = time.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

export function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60_000);
}

export function dayRange(date: string) {
  const start = dateTimeFromParts(date, "00:00");
  const end = addMinutes(start, 24 * 60);
  return { start, end };
}

export function rangesOverlap(firstStart: Date, firstEnd: Date, secondStart: Date, secondEnd: Date) {
  return firstStart < secondEnd && firstEnd > secondStart;
}

export function formatSlotKey(startAt: Date) {
  return `slot:${startAt.toISOString()}`;
}

export function formatMoney(priceCents: number) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(priceCents / 100);
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "medium",
  }).format(date);
}

export function formatTime(date: Date) {
  return new Intl.DateTimeFormat("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function todayInputValue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
