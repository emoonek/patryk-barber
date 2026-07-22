import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { BOOKING_SLOT_STARTS, getOpeningHoursForDate } from "../src/modules/booking/opening-hours";

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "spontan2wz@gmail.com";
const ADMIN_INITIAL_PASSWORD = process.env.ADMIN_INITIAL_PASSWORD;

function isProduction() {
  return process.env.NODE_ENV === "production" || process.env.APP_ENV === "production";
}

function passwordWithPepper(password: string) {
  const pepper = process.env.PASSWORD_PEPPER;

  if (isProduction() && (!pepper || pepper.length < 32)) {
    throw new Error("PASSWORD_PEPPER must have at least 32 characters in production.");
  }

  return `${password}${pepper ?? ""}`;
}

function validateProductionAdminPassword(password: string) {
  if (!isProduction()) {
    return;
  }

  const hasStrongLength = password.length >= 14;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  if (!hasStrongLength || !hasLowercase || !hasUppercase || !hasNumber || !hasSymbol) {
    throw new Error(
      "ADMIN_INITIAL_PASSWORD must be a strong temporary password in production and changed after first login.",
    );
  }
}

const services = [
  {
    name: "Strzyżenie męskie klasyczne",
    slug: "strzyzenie-meskie-klasyczne",
    description: null,
    priceCents: 6000,
    durationMinutes: 60,
    sortOrder: 10,
  },
  {
    name: "Strzyżenie męskie",
    slug: "strzyzenie-meskie",
    description: "Taper fade, skin fade i fryzury teksturowane",
    priceCents: 7000,
    durationMinutes: 60,
    sortOrder: 20,
  },
  {
    name: "Strzyżenie długich włosów",
    slug: "strzyzenie-meskie-dlugie-wlosy",
    description: null,
    priceCents: 8000,
    durationMinutes: 60,
    sortOrder: 30,
  },
  {
    name: "Trymowanie i kontur brody",
    slug: "trymowanie-kontur-brody",
    description: null,
    priceCents: 4000,
    durationMinutes: 60,
    sortOrder: 40,
  },
  {
    name: "Combo",
    slug: "combo-strzyzenie-glowy-broda",
    description: "Strzyżenie włosów i brody",
    priceCents: 11000,
    durationMinutes: 60,
    sortOrder: 50,
  },
  {
    name: "Pakiet ojciec + syn",
    slug: "pakiet-ojciec-syn",
    description: null,
    priceCents: 11000,
    durationMinutes: 60,
    sortOrder: 60,
  },
];

const activeServiceSlugs = services.map((service) => service.slug);

const availabilityRules = [1, 2, 3, 4, 5, 6].flatMap((dayOfWeek) => {
  const openingHours = getOpeningHoursForDate(dateForDayOfWeek(dayOfWeek));

  if (!openingHours.isOpen || !openingHours.firstSlotStart || !openingHours.lastSlotStart) {
    return [];
  }

  return {
    dayOfWeek,
    startTime: openingHours.firstSlotStart,
    endTime: slotEndTime(openingHours.lastSlotStart),
    slotMinutes: 60,
    isActive: true,
  };
});

const galleryImages = [
  {
    imageUrl: "/ig/Buzz Cut z Fade’em i Konturowaniem Brody.png",
    altText:
      "Krótkie, równo przycięte włosy połączone z płynnym cieniowaniem oraz precyzyjnie wyznaczoną linią włosów i brody.",
    title: "Buzz Cut z Fade’em i Konturowaniem Brody",
    sortOrder: 10,
  },
  {
    imageUrl: "/ig/Textured Crop z Hair Designem.png",
    altText: "Krótka, teksturowana góra, delikatne cieniowanie oraz indywidualny wzór wycięty nad uchem.",
    title: "Textured Crop z Hair Designem",
    sortOrder: 20,
  },
  {
    imageUrl: "/ig/French Crop z Mid Fade’em.png",
    altText: "Klasyczna krótka grzywka, równa tekstura na górze i płynne przejście po bokach.",
    title: "French Crop z Mid Fade’em",
    sortOrder: 30,
  },
  {
    imageUrl: "/ig/Klasyczne Strzyżenie z Side Partem.png",
    altText:
      "Elegancka fryzura zaczesana na bok, wykonana głównie nożyczkami i wykończona naturalnym cieniowaniem.",
    title: "Klasyczne Strzyżenie z Side Partem",
    sortOrder: 40,
  },
  {
    imageUrl: "/ig/Krótki Crop z Low Fade’em.png",
    altText: "Praktyczna, krótka fryzura z naturalnie ułożoną górą i subtelnym przejściem przy bokach.",
    title: "Krótki Crop z Low Fade’em",
    sortOrder: 50,
  },
  {
    imageUrl: "/ig/Modern Quiff z Taper Fade’em.png",
    altText:
      "Dłuższa, uniesiona i zaczesana do tyłu góra z delikatnym zwężeniem boków oraz naturalnie dopasowaną brodą.",
    title: "Modern Quiff z Taper Fade’em",
    sortOrder: 60,
  },
  {
    imageUrl: "/ig/Krótki Crop z Fade’em i Długą Brodą.png",
    altText: "Krótkie, uporządkowane strzyżenie zestawione z wyraźnie wykonturowaną, pełną brodą.",
    title: "Krótki Crop z Fade’em i Długą Brodą",
    sortOrder: 70,
  },
  {
    imageUrl: "/ig/Textured Crop z Geometrycznym Wzorem.png",
    altText: "Swobodnie ułożona, teksturowana góra połączona z cieniowaniem i wyciętym wzorem po boku.",
    title: "Textured Crop z Geometrycznym Wzorem",
    sortOrder: 80,
  },
  {
    imageUrl: "/ig/Textured French Crop.png",
    altText: "Fryzura z mocno zaakcentowaną teksturą, krótką grzywką i miękkim przejściem po bokach.",
    title: "Textured French Crop",
    sortOrder: 90,
  },
  {
    imageUrl: "/ig/Textured Quiff z Low Fade’em.png",
    altText: "Objętościowa, dynamicznie ułożona góra z czystym i subtelnym cieniowaniem wokół uszu.",
    title: "Textured Quiff z Low Fade’em",
    sortOrder: 100,
  },
  {
    imageUrl: "/ig/Textured Crop z Mid Fade’em.png",
    altText: "Nowoczesna, krótka fryzura z teksturą na górze oraz wyraźnym, lecz płynnym cieniowaniem boków.",
    title: "Textured Crop z Mid Fade’em",
    sortOrder: 110,
  },
  {
    imageUrl: "/ig/Modern Mullet z Taper Fade’em.png",
    altText: "Nowoczesna wersja fryzury mullet z dłuższym tyłem, kręconą teksturą i oczyszczonymi bokami.",
    title: "Modern Mullet z Taper Fade’em",
    sortOrder: 120,
  },
  {
    imageUrl: "/ig/Skin Fade – Detal Cieniowania.png",
    altText: "Precyzyjne przejście od skóry do dłuższych włosów, pokazujące jakość i płynność wykonanego fade’u.",
    title: "Skin Fade – Detal Cieniowania",
    sortOrder: 130,
  },
  {
    imageUrl: "/ig/Buzz Cut z Pełnym Konturowaniem Brody.png",
    altText: "Bardzo krótkie strzyżenie połączone z gęstą brodą, wykończoną ostrymi i symetrycznymi liniami.",
    title: "Buzz Cut z Pełnym Konturowaniem Brody",
    sortOrder: 140,
  },
  {
    imageUrl: "/ig/Dziecięcy Textured Crop z Fade’em.png",
    altText: "Krótka, lekka i łatwa do układania fryzura z postrzępioną górą oraz płynnym cieniowaniem boków.",
    title: "Dziecięcy Textured Crop z Fade’em",
    sortOrder: 150,
  },
];

async function main() {
  if (!ADMIN_INITIAL_PASSWORD) {
    throw new Error("Missing ADMIN_INITIAL_PASSWORD in environment.");
  }

  validateProductionAdminPassword(ADMIN_INITIAL_PASSWORD);

  const passwordHash = await bcrypt.hash(passwordWithPepper(ADMIN_INITIAL_PASSWORD), 12);

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
      phone: "513296426",
    },
  });

  await prisma.service.updateMany({
    where: {
      slug: {
        notIn: activeServiceSlugs,
      },
      isActive: true,
    },
    data: {
      isActive: false,
    },
  });

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {
        name: service.name,
        description: service.description ?? null,
        priceCents: service.priceCents,
        durationMinutes: service.durationMinutes,
        sortOrder: service.sortOrder,
        isActive: true,
      },
      create: service,
    });
  }

  for (const rule of availabilityRules) {
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

  await prisma.galleryImage.updateMany({
    where: {
      imageUrl: {
        startsWith: "/galeria-testowa/",
      },
      isPublished: true,
    },
    data: {
      isPublished: false,
    },
  });

  for (const image of galleryImages) {
    const existingImage = await prisma.galleryImage.findFirst({
      where: { imageUrl: image.imageUrl },
      select: { id: true },
    });

    if (existingImage) {
      await prisma.galleryImage.update({
        where: { id: existingImage.id },
        data: {
          altText: image.altText,
          title: image.title,
          sortOrder: image.sortOrder,
          isPublished: true,
        },
      });
    } else {
      await prisma.galleryImage.create({
        data: {
          ...image,
          isPublished: true,
        },
      });
    }
  }
}

function dateForDayOfWeek(dayOfWeek: number) {
  return new Date(2026, 6, 19 + dayOfWeek);
}

function slotEndTime(slotStart: string) {
  const index = BOOKING_SLOT_STARTS.indexOf(slotStart as (typeof BOOKING_SLOT_STARTS)[number]);
  return BOOKING_SLOT_STARTS[index + 1] ?? addHours(slotStart, 1);
}

function addHours(time: string, hoursToAdd: number) {
  const [hours, minutes] = time.split(":").map(Number);
  return `${String(hours + hoursToAdd).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
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
