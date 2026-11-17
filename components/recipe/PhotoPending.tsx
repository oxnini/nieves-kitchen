import { Camera } from 'lucide-react';

interface Props {
  /** `card` for grid cards, `hero` for the recipe header, `thumb` for small
      list thumbnails, where only the camera fits. */
  size?: 'card' | 'hero' | 'thumb';
}

/**
 * What a recipe shows in place of its photo until the photo is uploaded
 * (audit S1). The dishes have been cooked and photographed; the picture just
 * has not landed yet, so the plate says so rather than sitting blank, which
 * read as a broken image. A mount on the paper: a hairline frame inset from
 * the edge, a line camera and one italic line.
 *
 * Fills its parent, which must be `relative` and sized (every call site
 * already is, for the `<Image fill>` it stands in for).
 */
export default function PhotoPending({ size = 'card' }: Props) {
  const thumb = size === 'thumb';
  return (
    <div className="absolute inset-0 grid place-items-center bg-parchment-dark">
      <div
        aria-hidden="true"
        className={`absolute border border-line ${thumb ? 'inset-1.5' : 'inset-3'}`}
      />
      <div className="relative flex flex-col items-center gap-2 px-4 text-center text-brown-medium">
        <Camera
          size={thumb ? 18 : size === 'hero' ? 24 : 20}
          strokeWidth={1.5}
          aria-hidden="true"
        />
        {thumb ? (
          <span className="sr-only">Photo on its way</span>
        ) : (
          <span
            className={`font-heading italic leading-snug ${size === 'hero' ? 'text-[17px]' : 'text-[15px]'}`}
          >
            Photo on its way
          </span>
        )}
      </div>
    </div>
  );
}
