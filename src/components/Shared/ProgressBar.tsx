'use client';

interface ProgressBarProps {
  progress: number; // 0 to 1
  color?: string;
  height?: number;
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export default function ProgressBar({
  progress,
  color = '#F5C842',
  height = 8,
  showLabel = false,
  label,
  className = '',
}: ProgressBarProps) {
  const pct = Math.min(Math.max(progress, 0), 1) * 100;

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-xs text-text-secondary">{label}</span>}
          <span className="text-xs text-text-muted">{Math.round(pct)}%</span>
        </div>
      )}
      <div
        className="w-full rounded-full overflow-hidden bg-bg-tertiary"
        style={{ height }}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}, ${color}dd)`,
          }}
        />
      </div>
    </div>
  );
}
