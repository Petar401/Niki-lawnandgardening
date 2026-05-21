import { useSceneStore, type Season, currentSeason } from '@/store/useSceneStore';

const SEASONS: Array<{ id: Season; label: string; icon: string }> = [
  { id: 'spring', label: 'Spring', icon: '🌷' },
  { id: 'summer', label: 'Summer', icon: '🌞' },
  { id: 'autumn', label: 'Autumn', icon: '🍂' },
  { id: 'winter', label: 'Winter', icon: '❄️' },
];

/**
 * Tiny chip-row to override the auto-cycling season, or click "Auto" to
 * resume cycling. Sits in the navbar (desktop) and the mobile sheet.
 */
export function SeasonSwitcher({ compact = false }: { compact?: boolean }) {
  const seasonOverride = useSceneStore((s) => s.seasonOverride);
  const setSeasonOverride = useSceneStore((s) => s.setSeasonOverride);
  const current = useSceneStore(currentSeason);

  const active = seasonOverride ?? current;

  return (
    <div
      className={`glass inline-flex items-center gap-0.5 rounded-full ${compact ? 'p-0.5' : 'p-1'}`}
      role="group"
      aria-label="Season"
    >
      <button
        type="button"
        onClick={() => setSeasonOverride(null)}
        title="Auto cycle"
        aria-pressed={seasonOverride === null}
        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors ${
          seasonOverride === null
            ? 'bg-sun-500 text-dusk-900'
            : 'text-cream hover:bg-cream/10'
        }`}
      >
        Auto
      </button>
      {SEASONS.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => setSeasonOverride(s.id)}
          aria-pressed={seasonOverride === s.id}
          title={s.label}
          className={`rounded-full px-2 py-1 text-sm transition-colors ${
            active === s.id && seasonOverride !== null
              ? 'bg-sun-500/90 text-dusk-900'
              : active === s.id
                ? 'text-sun-200'
                : 'text-cream hover:bg-cream/10'
          }`}
        >
          <span aria-hidden>{s.icon}</span>
          <span className="sr-only">{s.label}</span>
        </button>
      ))}
    </div>
  );
}
