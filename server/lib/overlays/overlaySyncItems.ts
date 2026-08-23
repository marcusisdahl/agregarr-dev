import type { PlexLibraryItem } from '@server/api/plexapi';
import type { OverlayItemInput } from './OverlayLibraryService';
import type { OverlayArtworkTarget } from './overlayTargets';

/** Convert Plex listings into target-aware overlay work, retaining the parent
 * show as a metadata fallback for season and episode artwork. */
export function buildOverlaySyncItems(
  items: PlexLibraryItem[],
  target: OverlayArtworkTarget
): OverlayItemInput[] {
  return items
    .filter((item) =>
      target === 'main'
        ? item.type !== 'season' && item.type !== 'episode'
        : item.type === target
    )
    .map((item) => ({
      ratingKey: item.ratingKey,
      title: getOverlaySyncItemTitle(item, target),
      target,
      contextFallbackRatingKey:
        target === 'season'
          ? item.parentRatingKey
          : target === 'episode'
          ? item.grandparentRatingKey
          : undefined,
      contextOverrides:
        target === 'season'
          ? { seasonNumber: item.index, episodeNumber: undefined }
          : target === 'episode'
          ? { seasonNumber: item.parentIndex, episodeNumber: item.index }
          : undefined,
    }));
}

function getOverlaySyncItemTitle(
  item: PlexLibraryItem,
  target: OverlayArtworkTarget
): string {
  if (target === 'season') {
    return item.parentTitle
      ? `${item.parentTitle} - ${item.title}`
      : item.title;
  }

  if (target === 'episode') {
    const episodeCode =
      item.parentIndex !== undefined && item.index !== undefined
        ? `S${String(item.parentIndex).padStart(2, '0')}E${String(
            item.index
          ).padStart(2, '0')}`
        : undefined;

    return [item.grandparentTitle, episodeCode, item.title]
      .filter(Boolean)
      .join(' - ');
  }

  return item.title;
}
