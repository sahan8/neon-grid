/** Segmented neon meter (10 blocks). */
export function StatBar({
  label,
  value,
  max = 10,
  color = '#00F0FF',
  compact = false,
}: {
  label: string;
  value: number;
  max?: number;
  color?: string;
  compact?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className={`hud-label shrink-0 ${compact ? 'w-20 text-[10px]' : 'w-28'}`}>{label}</span>
      <div
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        className="grid flex-1 gap-[3px]"
        style={{ gridTemplateColumns: `repeat(${max}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: max }, (_, i) => {
          const on = i < value;
          return (
            <span
              key={i}
              className="h-2.5"
              style={{
                background: on ? color : 'rgba(0,240,255,0.06)',
                border: `1px solid ${on ? color : 'rgba(0,240,255,0.18)'}`,
                boxShadow: on ? `0 0 6px ${color}99` : 'none',
                clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)',
              }}
            />
          );
        })}
      </div>
      <span className="w-8 text-right font-mono text-xs text-ink">{String(value).padStart(2, '0')}</span>
    </div>
  );
}
