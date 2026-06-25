import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "spontan2wz@gmail.com";
const ADMIN_INITIAL_PASSWORD = process.env.ADMIN_INITIAL_PASSWORD;

function passwordWithPepper(password: string) {
  return `${password}${process.env.PASSWORD_PEPPER ?? ""}`;
}

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

const galleryImages = [
  {
    imageUrl: "/galeria-testowa/fryzurameskatexturedcropfade.png",
    altText: "Fryzura meska textured crop z fade",
    title: "Textured crop z czystym przejsciem fade.",
    sortOrder: 10,
  },
  {
    imageUrl: "/galeria-testowa/skinfadeztylu.png",
    altText: "Skin fade widoczny z tylu",
    title: "Precyzyjny skin fade i dopracowany tyl fryzury.",
    sortOrder: 20,
  },
  {
    imageUrl: "/galeria-testowa/kreconewlosy-krotkieboki.png",
    altText: "Krecone wlosy z krotkimi bokami",
    title: "Naturalne loki z lekkim kontrastem po bokach.",
    sortOrder: 30,
  },
  {
    imageUrl: "/galeria-testowa/slickback-broda.png",
    altText: "Slick back z zadbana broda",
    title: "Klasyczny slick back polaczony z broda.",
    sortOrder: 40,
  },
  {
    imageUrl: "/galeria-testowa/klasycznafryzurazprzedzialkiem.png",
    altText: "Klasyczna fryzura meska z przedzialkiem",
    title: "Elegancka klasyka z naturalnym przedzialkiem.",
    sortOrder: 50,
  },
  {
    imageUrl: "/galeria-testowa/fade-broda.png",
    altText: "Fade polaczony z broda",
    title: "Fade i broda prowadzone w jednej linii stylu.",
    sortOrder: 60,
  },
  {
    imageUrl: "/galeria-testowa/cropfade-frenchcrop.png",
    altText: "French crop z fade",
    title: "French crop z tekstura i krotkimi bokami.",
    sortOrder: 70,
  },
  {
    imageUrl: "/galeria-testowa/konturowaniebrody.png",
    altText: "Konturowanie brody",
    title: "Dokladne kontury brody i czysta linia policzka.",
    sortOrder: 80,
  },
  {
    imageUrl: "/galeria-testowa/przedipo-metamorfoza.png",
    altText: "Metamorfoza przed i po",
    title: "Widoczna zmiana po strzyzeniu i stylizacji.",
    sortOrder: 90,
  },
  {
    imageUrl: "/galeria-testowa/wnetrzesalonu.png",
    altText: "Wnetrze salonu Patryk Barber",
    title: "Klimat salonu przygotowanego na wizyte.",
    sortOrder: 100,
  },
  {
    imageUrl: "/galeria-testowa/narzedzia.png",
    altText: "Narzedzia barberskie",
    title: "Narzedzia gotowe do precyzyjnej pracy.",
    sortOrder: 110,
  },
  {
    imageUrl: "/galeria-testowa/barberprzypracy.png",
    altText: "Barber podczas pracy",
    title: "Kadr z codziennej pracy przy fotelu.",
    sortOrder: 120,
  },
];

async function main() {
  if (!ADMIN_INITIAL_PASSWORD) {
    throw new Error("Missing ADMIN_INITIAL_PASSWORD in environment.");
  }

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

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
