-- AlterTable
ALTER TABLE "bookings"
ADD COLUMN "serviceNameSnapshot" TEXT,
ADD COLUMN "servicePriceCentsSnapshot" INTEGER,
ADD COLUMN "serviceDurationMinutesSnapshot" INTEGER;

-- Backfill existing bookings from the currently related service.
UPDATE "bookings" AS b
SET
    "serviceNameSnapshot" = s."name",
    "servicePriceCentsSnapshot" = s."priceCents",
    "serviceDurationMinutesSnapshot" = s."durationMinutes"
FROM "services" AS s
WHERE b."serviceId" = s."id";

-- Make snapshots required for every booking.
ALTER TABLE "bookings"
ALTER COLUMN "serviceNameSnapshot" SET NOT NULL,
ALTER COLUMN "servicePriceCentsSnapshot" SET NOT NULL,
ALTER COLUMN "serviceDurationMinutesSnapshot" SET NOT NULL;
