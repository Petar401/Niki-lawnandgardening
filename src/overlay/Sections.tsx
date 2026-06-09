import { ZONE_ORDER } from '@/scene/navigationNodes';

/**
 * Invisible scroll surface. One full-height section per zone gives the page
 * its scroll height so `useScrollProgress` can map scroll position → zone as
 * a fallback to clicking hotspots / the minimap. All visible copy now lives
 * in <ZonePanel/>, so these sections are purely structural and aria-hidden.
 */
export function Sections() {
  return (
    <div aria-hidden="true">
      {ZONE_ORDER.map((id) => (
        <section key={id} id={id} className="pointer-events-none h-screen w-full" />
      ))}
    </div>
  );
}
