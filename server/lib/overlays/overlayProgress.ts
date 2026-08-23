import type { OverlayArtworkTarget } from './overlayTargets';

export interface OverlayTargetProgress {
  totalItems: number;
  currentItem: number;
  successCount: number;
  errorCount: number;
  skippedCount: number;
}

export type OverlayTargetProgressMap = Record<
  OverlayArtworkTarget,
  OverlayTargetProgress
>;

const emptyTargetProgress = (): OverlayTargetProgress => ({
  totalItems: 0,
  currentItem: 0,
  successCount: 0,
  errorCount: 0,
  skippedCount: 0,
});

export function createOverlayTargetProgress(): OverlayTargetProgressMap {
  return {
    main: emptyTargetProgress(),
    season: emptyTargetProgress(),
    episode: emptyTargetProgress(),
  };
}

export function cloneOverlayTargetProgress(
  progress: OverlayTargetProgressMap
): OverlayTargetProgressMap {
  return {
    main: { ...progress.main },
    season: { ...progress.season },
    episode: { ...progress.episode },
  };
}

export function recordOverlayTargetOutcome(
  progress: OverlayTargetProgressMap,
  target: OverlayArtworkTarget,
  outcome: 'success' | 'skipped' | 'error'
): void {
  const targetProgress = progress[target];
  targetProgress.currentItem++;

  if (outcome === 'success') targetProgress.successCount++;
  else if (outcome === 'error') targetProgress.errorCount++;
  else targetProgress.skippedCount++;
}
