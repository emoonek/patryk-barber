ALTER TABLE "users"
ADD COLUMN "isBlocked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "blockedReason" TEXT,
ADD COLUMN "blockedAt" TIMESTAMP(3),
ADD COLUMN "blockedByAdminId" TEXT;

CREATE INDEX "users_isBlocked_idx" ON "users"("isBlocked");
