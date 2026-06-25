import type { GalleryActionState } from "../gallery.actions";

type GalleryActionMessageProps = {
  state: GalleryActionState;
};

export function GalleryActionMessage({ state }: GalleryActionMessageProps) {
  if (!state.message) {
    return null;
  }

  return (
    <p className={state.ok ? "text-sm text-green-300" : "text-sm text-red-300"}>
      {state.message}
    </p>
  );
}
