import { deleteGalleryImageAction, toggleGalleryImageVisibleAction } from "../gallery.actions";

type GalleryAdminActionsProps = {
  image: {
    id: string;
    isPublished: boolean;
  };
};

export function GalleryAdminActions({ image }: GalleryAdminActionsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <form action={toggleGalleryImageVisibleAction}>
        <input name="imageId" type="hidden" value={image.id} />
        <input name="isVisible" type="hidden" value={image.isPublished ? "false" : "true"} />
        <button className="font-semibold text-barber-brass">
          {image.isPublished ? "Ukryj" : "Pokaz"}
        </button>
      </form>

      <form action={deleteGalleryImageAction}>
        <input name="imageId" type="hidden" value={image.id} />
        <button className="font-semibold text-red-300">Usun</button>
      </form>
    </div>
  );
}
