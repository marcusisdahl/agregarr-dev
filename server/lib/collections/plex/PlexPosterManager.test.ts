import { describe, expect, it } from 'vitest';
import { selectPreferredPosterReference } from './posterSelection';

describe('selectPreferredPosterReference', () => {
  it('prefers a selected Posterizarr-style upload over an earlier TMDB poster', () => {
    expect(
      selectPreferredPosterReference([
        {
          ratingKey: 'https://image.tmdb.org/t/p/original/tmdb.jpg',
          thumb: '/library/metadata/42/thumb/tmdb',
        },
        {
          ratingKey: 'upload://posters/425574157063dce0',
          thumb: '/library/metadata/42/thumb/425574157063dce0',
          selected: '1',
        },
      ])
    ).toBe('upload://posters/425574157063dce0');
  });

  it('keeps a selected metadata poster when no uploaded poster is selected', () => {
    expect(
      selectPreferredPosterReference([
        {
          ratingKey: 'metadata://posters/tv.plex.agents.movie_hash',
          selected: 1,
        },
      ])
    ).toBe('metadata://posters/tv.plex.agents.movie_hash');
  });

  it('falls back to an uploaded poster when Plex omits selected markers', () => {
    expect(
      selectPreferredPosterReference([
        { ratingKey: 'https://image.tmdb.org/t/p/original/tmdb.jpg' },
        { ratingKey: 'upload://posters/posterizarr-hash' },
      ])
    ).toBe('upload://posters/posterizarr-hash');
  });

  it('returns null when no poster is usable', () => {
    expect(selectPreferredPosterReference([])).toBeNull();
  });
});
