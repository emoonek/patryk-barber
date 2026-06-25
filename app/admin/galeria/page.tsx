import Link from "next/link";
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
  const showDeveloperOptions = process.env.APP_ENV === "development";
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
        <div className="flex flex-wrap gap-3">
          <Link
            className="border border-white/15 px-5 py-3 text-sm font-semibold text-barber-cream transition hover:border-barber-brass"
            href="/admin"
          >
            Dashboard
          </Link>
          <Link
            className="bg-barber-brass px-5 py-3 text-sm font-semibold text-black transition hover:bg-barber-cream"
            href="#dodaj-zdjecie"
          >
            Dodaj zdjecie
          </Link>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto border border-white/10 bg-black/20">
        <table className="w-full min-w-[1180px] border-collapse text-left text-sm">
          <thead className="text-barber-muted">
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 font-medium">Miniatura</th>
              <th className="px-4 py-3 font-medium">Image URL</th>
              <th className="px-4 py-3 font-medium">Zrodlo</th>
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
                <td className="max-w-[260px] px-4 py-3 font-mono text-xs text-barber-cream">
                  {image.imageUrl}
                </td>
                <td className="px-4 py-3">
                  {image.storageKey ? (
                    <span className="border border-green-300/30 px-2 py-1 text-xs text-green-200">Storage</span>
                  ) : (
                    <span className="border border-white/10 px-2 py-1 text-xs text-barber-muted">Reczny URL</span>
                  )}
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
          <p className="p-5 text-sm text-barber-muted">Nie dodano jeszcze zadnych zdjec.</p>
        ) : null}
      </div>

      {params.edit && !editedImage ? (
        <p className="mt-6 border border-red-300/30 bg-red-950/20 p-5 text-sm text-red-100">
          Nie znaleziono zdjecia do edycji.
        </p>
      ) : null}

      {editedImage ? (
        <div className="mt-8" id="edytuj-zdjecie">
          <GalleryAdminForm image={editedImage} mode="edit" showDeveloperOptions={showDeveloperOptions} />
        </div>
      ) : null}

      <div className="mt-8" id="dodaj-zdjecie">
        <GalleryAdminForm mode="create" showDeveloperOptions={showDeveloperOptions} />
      </div>

      <div className="mt-8 border border-white/10 bg-black/20 p-5 text-sm leading-6 text-barber-muted">
        Upload plikow korzysta z warstwy storage przygotowanej pod Cloudinary. W development nadal mozna
        wpisac imageUrl recznie, np. do zdjec z katalogu public/galeria-testowa.
      </div>
    </section>
  );
}
