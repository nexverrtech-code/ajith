/**
 * Responsive <picture> for the variants generated into /public/media by
 * scripts/optimize-images.mjs.
 *
 * Serves AVIF first, WebP second, JPEG last, and lets the browser pick a width
 * from srcset — a phone pulls the 480w file (~20 KB) instead of the 2.3 MB PNG
 * master. Width/height are set so the layout doesn't shift while it loads.
 */
const WIDTHS = [480, 768, 1200];

const Picture = ({
  slug,
  alt,
  className = "",
  sizes = "(max-width: 767px) 100vw, (max-width: 1023px) 90vw, 620px",
  loading = "lazy",
  fetchPriority,
  width = 1200,
  height = 750,
}) => {
  const srcset = (ext) =>
    WIDTHS.map((w) => `/media/${slug}-${w}.${ext} ${w}w`).join(", ");

  return (
    <picture>
      <source type="image/avif" srcSet={srcset("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcset("webp")} sizes={sizes} />
      <img
        src={`/media/${slug}-1200.jpg`}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
        className={className}
      />
    </picture>
  );
};

export default Picture;
