"use client";

import { useActionState } from "react";
import { deleteGalleryImageAction, toggleGalleryImageVisibleAction } from "../gallery.actions";
import { GalleryActionMessage } from "./gallery-action-message";

type GalleryAdminActionsProps = {
  image: {
    id: string;
    isPublished: boolean;
  };
};

export function GalleryAdminActions({ image }: GalleryAdminActionsProps) {
  const [deleteState, deleteFormAction, deletePending] = useActionState(deleteGalleryImageAction, {});

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap gap-3">
      <form action={toggleGalleryImageVisibleAction}>
        <input name="imageId" type="hidden" value={image.id} />
        <input name="isVisible" type="hidden" value={image.isPublished ? "false" : "true"} />
        <button className="font-semibold text-barber-brass">
          {image.isPublished ? "Ukryj" : "Pokaz"}
        </button>
      </form>

      <form action={deleteFormAction}>
        <input name="imageId" type="hidden" value={image.id} />
        <button className="font-semibold text-red-300 disabled:opacity-60" disabled={deletePending}>
          Usun
        </button>
      </form>
      </div>
      <GalleryActionMessage state={deleteState} />
    </div>
  );
}
