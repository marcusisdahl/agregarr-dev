import type { OverlayArtworkTarget } from '@server/lib/overlays/overlayTargets';
import type React from 'react';

export interface OverlayTargetProgressValue {
  totalItems: number;
  currentItem: number;
  successCount: number;
  errorCount: number;
  skippedCount: number;
}

export type OverlayTargetProgressMap = Partial<
  Record<OverlayArtworkTarget, OverlayTargetProgressValue>
>;

interface OverlayTargetProgressProps {
  progress?: OverlayTargetProgressMap;
  currentTarget?: OverlayArtworkTarget | null;
}

const targets: {
  target: OverlayArtworkTarget;
  label: string;
}[] = [
  { target: 'main', label: 'Posters' },
  { target: 'season', label: 'Seasons' },
  { target: 'episode', label: 'Episodes' },
];

const OverlayTargetProgress: React.FC<OverlayTargetProgressProps> = ({
  progress,
  currentTarget,
}) => {
  const visibleTargets = targets.filter(({ target }) => {
    const value = progress?.[target];
    return value && (value.totalItems > 0 || value.currentItem > 0);
  });

  if (visibleTargets.length === 0) return null;

  return (
    <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
      {visibleTargets.map(({ target, label }) => {
        const value = progress?.[target];
        if (!value) return null;

        const percent =
          value.totalItems > 0
            ? Math.min(
                100,
                Math.round((value.currentItem / value.totalItems) * 100)
              )
            : 0;
        const isCurrent = currentTarget === target;

        return (
          <div
            key={target}
            className={`rounded-md border bg-stone-900 px-3 py-2 ${
              isCurrent ? 'border-orange-500' : 'border-stone-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs">
              <span className={isCurrent ? 'text-orange-300' : 'text-gray-400'}>
                {label}
              </span>
              <span className="font-medium text-gray-200">
                {value.currentItem}/{value.totalItems}
              </span>
            </div>
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-gray-700">
              <div
                className={`h-full transition-all duration-300 ${
                  isCurrent ? 'bg-orange-500' : 'bg-stone-500'
                }`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OverlayTargetProgress;
