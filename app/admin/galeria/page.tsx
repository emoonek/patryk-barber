import Link from "next/link";
import { getCloudinaryConfigStatus } from "@/lib/storage";
import { AdminNav } from "@/modules/admin/components/admin-nav";
import { requireAdmin } from "@/modules/auth/auth.guards";
import {
  getAdminGalleryImage,
  listAdminGalleryImages,
} from "@/modules/gallery/gallery.repository";
import { GalleryAdminActions } from "@/modules/gallery/components/gallery-admin-actions";
import { GalleryAdminForm } from "@/modules/gallery/components/gallery-admin-form";

export const metadata = {
  title: "Galeria admin",
};

type AdminGalleryPageProps = {
  searchParams?: Promise<{
    edit?: string;
  }>;
};

export default async function AdminGalleryPage({ searchParams }: AdminGalleryPageProps) {
  await requireAdmin();
  const params = (await searchParams) ?? {};
  const cloudinaryStatus = getCloudinaryConfigStatus();
  const [images, editedImage] = await Promise.all([
    listAdminGalleryImages(),
    params.edit ? getAdminGalleryImage(params.edit) : Promise.resolve(null),
  ]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 text-sm uppercase tracking-[0.24em] text-barber-brass">Admin</p>
          <h1 className="text-4xl font-semibold text-barber-cream">Galeria</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <AdminNav />
          <Link
            className="bg-barber-brass px-5 py-3 text-sm font-semibold text-black transition hover:bg-barber-cream"
            href="#dodaj-zdjecie"
          >
            Dodaj zdjęcie
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-[1fr_1.2fr]">
        <div
          className={`border p-5 text-sm leading-6 ${
            cloudinaryStatus.isConfigured
              ? "border-green-300/30 bg-green-950/20 text-green-100"
              : "border-yellow-300/30 bg-yellow-950/20 text-yellow-100"
          }`}
        >
          <p className="font-semibold">
            {cloudinaryStatus.isConfigured
              ? "Upload zdjęć jest aktywny"
              : "Upload zdjęć jest chwilowo niedostępny"}
          </p>
          {!cloudinaryStatus.isConfigured ? (
            <p className="mt-2 text-xs text-yellow-100/80">
              Skontaktuj się z osobą techniczną odpowiedzialną za konfigurację strony.
            </p>
          ) : null}
        </div>

        <div className="border border-white/10 bg-black/20 p-5 text-sm leading-6 text-barber-muted">
          <p className="font-semibold text-barber-cream">Instrukcja dodawania zdjęcia</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Wybierz plik JPG, PNG albo WebP.</li>
            <li>Upewnij się, że plik ma maksymalnie 5 MB.</li>
            <li>Uzupełnij opis zdjęcia w polu Alt text albo Caption.</li>
            <li>Kliknij Dodaj zdjęcie.</li>
          </ol>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto border border-white/10 bg-black/20">
        <table className="w-full min-w-[860px] border-collapse text-left text-sm">
          <thead className="text-barber-muted">
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 font-medium">Miniatura</th>
              <th className="px-4 py-3 font-medium">Alt text</th>
              <th className="px-4 py-3 font-medium">Caption</th>
              <th className="px-4 py-3 font-medium">Kolejnosc</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {images.map((image) => (
              <tr className="border-b border-white/10 text-barber-muted last:border-0" key={image.id}>
                <td className="px-4 py-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={image.altText}
                    className="h-16 w-16 border border-white/10 object-cover"
                    src={image.thumbnailUrl ?? image.imageUrl}
                  />
                </td>
                <td className="max-w-[220px] px-4 py-3">{image.altText}</td>
                <td className="max-w-[220px] px-4 py-3">{image.title ?? "-"}</td>
                <td className="px-4 py-3">{image.sortOrder}</td>
                <td className="px-4 py-3">{image.isPublished ? "Widoczne" : "Ukryte"}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-3">
                    <Link className="font-semibold text-barber-brass" href={`/admin/galeria?edit=${image.id}#edytuj-zdjecie`}>
                      Edytuj
                    </Link>
                    <GalleryAdminActions image={image} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {images.length === 0 ? (
          <p className="p-5 text-sm text-barber-muted">
            Brak zdjęć galerii. Dodaj pierwsze zdjęcie do portfolio.
          </p>
        ) : null}
      </div>

      {params.edit && !editedImage ? (
        <p className="mt-6 border border-red-300/30 bg-red-950/20 p-5 text-sm text-red-100">
          Nie znaleziono zdjęcia do edycji.
        </p>
      ) : null}

      {editedImage ? (
        <div className="mt-8" id="edytuj-zdjecie">
          <GalleryAdminForm image={editedImage} mode="edit" />
        </div>
      ) : null}

      <div className="mt-8" id="dodaj-zdjecie">
        <GalleryAdminForm mode="create" />
      </div>

      <div className="mt-8 border border-white/10 bg-black/20 p-5 text-sm leading-6 text-barber-muted">
        Upload zdjęć korzysta z Cloudinary. Po dodaniu zdjęcia możesz od razu ustawić jego opis,
        podpis, kolejność i widoczność w galerii.
      </div>
    </section>
  );
}
