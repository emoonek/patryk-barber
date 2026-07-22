import type { MetadataRoute } from "next";

const publicRoutes = [
  "/",
  "/galeria",
  "/kontakt",
  "/regulamin-rezerwacji",
  "/polityka-prywatnosci",
  "/rezerwacja",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const appUrl = process.env.APP_URL ?? "http://localhost:3000";
  const now = new Date();

  return publicRoutes.map((route) => ({
    url: new URL(route, appUrl).toString(),
    lastModified: now,
  }));
}
