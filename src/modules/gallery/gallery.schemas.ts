import { z } from "zod";

export const galleryCheckboxBooleanSchema = z.preprocess(
  (value) => value === "on" || value === "true",
  z.boolean(),
);

const imageUrlSchema = z
  .string()
  .trim()
  .refine(
    (value) => !value || value.startsWith("/") || value.startsWith("https://") || value.startsWith("http://"),
    "Adres zdjecia musi zaczynac sie od /, https:// albo http://.",
  );

const optionalCaptionSchema = z
  .string()
  .trim()
  .max(180, "Podpis moze miec maksymalnie 180 znakow.")
  .optional()
  .transform((value) => (value ? value : null));

export const galleryImageIdSchema = z.object({
  imageId: z.string().min(1, "Brakuje identyfikatora zdjecia."),
});

const galleryImageFormBaseSchema = z
  .object({
    imageUrl: imageUrlSchema,
    altText: z.string().trim().max(160, "Alt text moze miec maksymalnie 160 znakow.").optional(),
    caption: optionalCaptionSchema,
    sortOrder: z.coerce
      .number({ invalid_type_error: "Kolejnosc sortowania musi byc liczba." })
      .int("Kolejnosc sortowania musi byc liczba calkowita."),
    isVisible: galleryCheckboxBooleanSchema,
  })
  .transform(withGeneratedAltText);

export const galleryImageFormSchema = galleryImageFormBaseSchema;

export const createGalleryImageSchema = galleryImageFormBaseSchema;

export const updateGalleryImageSchema = galleryImageIdSchema
  .extend({
    imageUrl: imageUrlSchema,
    altText: z.string().trim().max(160, "Alt text moze miec maksymalnie 160 znakow.").optional(),
    caption: optionalCaptionSchema,
    sortOrder: z.coerce
      .number({ invalid_type_error: "Kolejnosc sortowania musi byc liczba." })
      .int("Kolejnosc sortowania musi byc liczba calkowita."),
    isVisible: galleryCheckboxBooleanSchema,
  })
  .transform(withGeneratedAltText);

export type CreateGalleryImageInput = z.infer<typeof createGalleryImageSchema>;
export type UpdateGalleryImageInput = z.infer<typeof updateGalleryImageSchema>;

function withGeneratedAltText<
  T extends {
  imageUrl: string;
  altText?: string;
  caption: string | null;
  sortOrder: number;
  isVisible: boolean;
  },
>(input: T): T & { altText: string } {
  return {
    ...input,
    altText: input.altText?.trim() || input.caption || buildAltTextFromUrl(input.imageUrl),
  };
}

function buildAltTextFromUrl(imageUrl: string) {
  const fileName = imageUrl.split("/").filter(Boolean).at(-1) ?? "zdjecie";
  return fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/^./, (letter) => letter.toUpperCase());
}
