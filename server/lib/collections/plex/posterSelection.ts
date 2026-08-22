export interface PlexPosterMetadata {
  selected?: string | number | boolean;
  thumb?: string;
  key?: string;
  ratingKey?: string;
}

const isSelectedPoster = (poster: PlexPosterMetadata): boolean =>
  poster.selected === '1' || poster.selected === 1 || poster.selected === true;

const getPosterReference = (poster: PlexPosterMetadata): string | undefined =>
  poster.ratingKey || poster.thumb || poster.key;

const isUploadedPoster = (poster: PlexPosterMetadata): boolean =>
  [poster.ratingKey, poster.thumb, poster.key].some((value) =>
    value?.includes('upload://posters/')
  );

/**
 * Prefer Plex's selected uploaded poster (including Posterizarr uploads), then
 * any selected poster, and finally an uploaded poster when Plex omitted the
 * selected marker. The latter fallback handles inconsistent poster-list
 * responses without allowing list order to make a TMDB poster win.
 */
export const selectPreferredPosterReference = (
  posters: PlexPosterMetadata[]
): string | null => {
  const preferredPoster =
    posters.find(
      (poster) => isSelectedPoster(poster) && isUploadedPoster(poster)
    ) ||
    posters.find(isSelectedPoster) ||
    posters.find(isUploadedPoster);

  return preferredPoster ? getPosterReference(preferredPoster) || null : null;
};
