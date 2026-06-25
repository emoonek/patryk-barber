"use client";

import { useActionState } from "react";
import {
  createGalleryImageAction,
  updateGalleryImageAction,
  type GalleryActionState,
} from "../gallery.actions";
import { GalleryActionMessage } from "./gallery-action-message";

type GalleryAdminFormProps = {
  mode: "create" | "edit";
  image?: {
    id: string;
    title: string | null;
    altText: string;
    imageUrl: string;
    sortOrder: number;
    isPublished: boolean;
  };
};

const initialState: GalleryActionState = {};

export function GalleryAdminForm({ mode, image }: GalleryAdminFormProps) {
  const action = mode === "create" ? createGalleryImageAction : updateGalleryImageAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const title = mode === "create" ? "Dodaj zdjecie" : "Edytuj zdjecie";

  return (
    <form action={formAction} className="grid gap-4 border border-white/10 bg-black/20 p-6">
      {image ? <input name="imageId" type="hidden" value={image.id} /> : null}
      <h2 className="text-2xl font-semibold text-barber-cream">{title}</h2>

      <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
        <label className="grid gap-2 text-sm text-barber-muted">
          Image URL
          <input
            className="border border-white/10 bg-[#120f0d] px-4 py-3 text-barber-cream"
            defaultValue={image?.imageUrl ?? ""}
            name="imageUrl"
            placeholder="/galeria-testowa/nazwa-pliku.png"
          />
          {state.errors?.imageUrl ? <span className="text-red-300">{state.errors.imageUrl[0]}</span> : null}
        </label>

        <label className="grid gap-2 text-sm text-barber-muted">
          Kolejnosc
          <input
            className="border border-white/10 bg-[#120f0d] px-4 py-3 text-barber-cream"
            defaultValue={image?.sortOrder ?? 0}
            name="sortOrder"
            type="number"
          />
          {state.errors?.sortOrder ? <span className="text-red-300">{state.errors.sortOrder[0]}</span> : null}
        </label>
      </div>

      <label className="grid gap-2 text-sm text-barber-muted">
        Alt text
        <input
          className="border border-white/10 bg-[#120f0d] px-4 py-3 text-barber-cream"
          defaultValue={image?.altText ?? ""}
          name="altText"
          placeholder="Opis zdjecia dla dostepnosci"
        />
        {state.errors?.altText ? <span className="text-red-300">{state.errors.altText[0]}</span> : null}
      </label>

      <label className="grid gap-2 text-sm text-barber-muted">
        Caption
        <input
          className="border border-white/10 bg-[#120f0d] px-4 py-3 text-barber-cream"
          defaultValue={image?.title ?? ""}
          name="caption"
          placeholder="Krotki podpis pod zdjeciem"
        />
        {state.errors?.caption ? <span className="text-red-300">{state.errors.caption[0]}</span> : null}
      </label>

      <label className="flex items-center gap-3 text-sm text-barber-muted">
        <input
          className="h-4 w-4 accent-barber-brass"
          defaultChecked={image?.isPublished ?? true}
          name="isVisible"
          type="checkbox"
        />
        Widoczne w publicznej galerii
      </label>

      <div className="flex flex-wrap items-center gap-4">
        <button
          className="bg-barber-brass px-5 py-3 text-sm font-semibold text-black transition hover:bg-barber-cream disabled:opacity-60"
          disabled={pending}
        >
          {mode === "create" ? "Dodaj zdjecie" : "Zapisz zdjecie"}
        </button>
        <GalleryActionMessage state={state} />
      </div>
    </form>
  );
}
