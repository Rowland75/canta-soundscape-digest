/** Lazy-loaded optional Spline scene. Rendered only when a verified URL is configured. */
const SplineBackground = ({ url }: { url: string }) => (
  <iframe
    src={url}
    title="Canta animated background"
    aria-hidden
    tabIndex={-1}
    loading="lazy"
    className="absolute inset-0 h-full w-full border-0 pointer-events-none"
  />
);
export default SplineBackground;
