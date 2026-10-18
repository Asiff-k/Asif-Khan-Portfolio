/**
 * Fixed overlays above the content and below dialogs. All ignore the pointer.
 * - Film grain: SVG turbulence tile, stepped at ~8fps (static for reduced motion).
 * - Vignette: dark scenes only, follows --scene-dark.
 * - Progressive blur: top and bottom edges in dark scenes, layered
 *   backdrop blurs under gradient masks. Hidden for reduced transparency.
 */
export function Overlays() {
  return (
    <>
      <div aria-hidden className="cinema-vignette" />
      <div aria-hidden className="cinema-edge cinema-edge--top">
        <span />
        <span />
        <span />
      </div>
      <div aria-hidden className="cinema-edge cinema-edge--bottom">
        <span />
        <span />
        <span />
      </div>
      <div aria-hidden className="cinema-grain" />
    </>
  );
}
