import type { PlexLibraryItem } from '@server/api/plexapi';
import { describe, expect, it } from 'vitest';
import { buildOverlaySyncItems } from './overlaySyncItems';

describe('overlay sync item expansion', () => {
  it('keeps season context tied to its parent show', () => {
    const items = [
      {
        ratingKey: 'season-1',
        parentRatingKey: 'show-1',
        title: 'Season 2',
        type: 'season',
        index: 2,
      },
    ] as PlexLibraryItem[];

    expect(buildOverlaySyncItems(items, 'season')).toEqual([
      {
        ratingKey: 'season-1',
        target: 'season',
        contextFallbackRatingKey: 'show-1',
        contextOverrides: { seasonNumber: 2, episodeNumber: undefined },
      },
    ]);
  });

  it('keeps episode, season, and parent-show context together', () => {
    const items = [
      {
        ratingKey: 'episode-1',
        grandparentRatingKey: 'show-1',
        title: 'Episode 8',
        type: 'episode',
        parentIndex: 3,
        index: 8,
      },
    ] as PlexLibraryItem[];

    expect(buildOverlaySyncItems(items, 'episode')).toEqual([
      {
        ratingKey: 'episode-1',
        target: 'episode',
        contextFallbackRatingKey: 'show-1',
        contextOverrides: { seasonNumber: 3, episodeNumber: 8 },
      },
    ]);
  });

  it('rejects Plex items that do not match the requested child target', () => {
    const movie = {
      ratingKey: 'movie-1',
      title: 'Movie',
      type: 'movie',
    } as PlexLibraryItem;

    expect(buildOverlaySyncItems([movie], 'season')).toEqual([]);
  });
});
