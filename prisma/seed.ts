import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "spontan2wz@gmail.com";
const ADMIN_INITIAL_PASSWORD = process.env.ADMIN_INITIAL_PASSWORD;

const services = [
  {
    name: "Strzyżenie męskie",
    slug: "strzyzenie-meskie",
    priceCents: 7000,
    durationMinutes: 60,
    sortOrder: 10,
  },
  {
    name: "Trymowanie kontur brody",
    slug: "trymowanie-kontur-brody",
    priceCents: 4000,
    durationMinutes: 60,
    sortOrder: 20,
  },
  {
    name: "Same boki",
    slug: "same-boki",
    priceCents: 6000,
    durationMinutes: 60,
    sortOrder: 30,
  },
  {
    name: "Combo (strzyżenie głowy + broda)",
    slug: "combo-strzyzenie-glowy-broda",
    priceCents: 11000,
    durationMinutes: 60,
    sortOrder: 40,
  },
  {
    name: "Strzyżenie męskie (długie włosy)",
    slug: "strzyzenie-meskie-dlugie-wlosy",
    priceCents: 7000,
    durationMinutes: 60,
    sortOrder: 50,
  },
];

const weekdayAvailabilityRules = [1, 2, 3, 4, 5].map((dayOfWeek) => ({
  dayOfWeek,
  startTime: "09:00",
  endTime: "17:00",
  slotMinutes: 60,
  isActive: true,
}));

async function main() {
  if (!ADMIN_INITIAL_PASSWORD) {
    throw new Error("Missing ADMIN_INITIAL_PASSWORD in environment.");
  }

  const passwordHash = await bcrypt.hash(ADMIN_INITIAL_PASSWORD, 12);

  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      passwordHash,
      role: UserRole.admin,
      emailVerifiedAt: new Date(),
      isActive: true,
    },
    create: {
      email: ADMIN_EMAIL,
      passwordHash,
      role: UserRole.admin,
      emailVerifiedAt: new Date(),
      firstName: "Patryk",
      lastName: "Barber",
      phone: "+48 575 088 360",
    },
  });

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {
        name: service.name,
        priceCents: service.priceCents,
        durationMinutes: service.durationMinutes,
        sortOrder: service.sortOrder,
        isActive: true,
      },
      create: service,
    });
  }

  for (const rule of weekdayAvailabilityRules) {
    await prisma.availabilityRule.upsert({
      where: {
        dayOfWeek_startTime_endTime: {
          dayOfWeek: rule.dayOfWeek,
          startTime: rule.startTime,
          endTime: rule.endTime,
        },
      },
      update: {
        slotMinutes: rule.slotMinutes,
        isActive: rule.isActive,
      },
      create: rule,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
