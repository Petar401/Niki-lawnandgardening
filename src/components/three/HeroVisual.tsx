import { lazy, Suspense, useEffect, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useInView } from '@/hooks/useInView';
import { hasWebGL } from '@/lib/webgl';
import { GardenPoster } from './GardenPoster';
import { cn } from '@/lib/cn';

const GardenScene = lazy(() => import('./GardenScene'));

type Props = {
  className?: string;
  /**
   * When true, the static SVG poster is rendered immediately and the 3D
   * scene is never loaded. Used for the lowest-power fallback.
   */
  forcePoster?: boolean;
};

export function HeroVisual({ className, forcePoster = false }: Props) {
  const reducedMotion = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: '120px', threshold: 0.05 });

  // WebGL detection runs once on the client.
  const [webglReady, setWebglReady] = useState<boolean | null>(null);
  useEffect(() => {
    setWebglReady(hasWebGL());
  }, []);

  const usePoster = forcePoster || webglReady === false;

  return (
    <div
      ref={ref}
      className={cn(
        'relative isolate aspect-[5/4] w-full overflow-hidden rounded-xl',
        'bg-gradient-to-b from-mist via-cream to-stone/50',
        'ring-1 ring-inset ring-stone/60 shadow-soft',
        className,
      )}
    >
      {/* Always render the poster as the visual base — covered by the canvas
         once it boots, but visible during loading and when it cannot. */}
      <div className="absolute inset-0">
        <GardenPoster className="h-full w-full" />
      </div>

      {!usePoster && webglReady !== null ? (
        <Suspense fallback={null}>
          <div
            className="absolute inset-0"
            role="img"
            aria-label="Interactive 3D illustration of a garden corner with a planter, shrubs, an ornamental tree, brick edging and a stone slab."
          >
            <GardenScene active={inView} reducedMotion={reducedMotion} />
          </div>
        </Suspense>
      ) : null}
    </div>
  );
}
