export type OverlayArtworkTarget = 'main' | 'season' | 'episode';

const TARGET_TAG_PREFIX = 'target:';
const TARGET_TAGS = new Set([
  `${TARGET_TAG_PREFIX}main`,
  `${TARGET_TAG_PREFIX}season`,
  `${TARGET_TAG_PREFIX}episode`,
]);

export function getOverlayTargets(tags?: string[]): OverlayArtworkTarget[] {
  const targets = (tags ?? [])
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag) => TARGET_TAGS.has(tag))
    .map((tag) => tag.slice(TARGET_TAG_PREFIX.length) as OverlayArtworkTarget);

  // Templates created before artwork targets existed remain main-poster
  // templates. This keeps every existing library configuration unchanged.
  return targets.length > 0 ? Array.from(new Set(targets)) : ['main'];
}

export function targetsArtwork(
  tags: string[] | undefined,
  target: OverlayArtworkTarget
): boolean {
  return getOverlayTargets(tags).includes(target);
}

export function isOverlayCompatibleWithLibrary(
  tags: string[] | undefined,
  libraryType: 'movie' | 'show'
): boolean {
  return libraryType === 'show' || targetsArtwork(tags, 'main');
}

export function setOverlayTargetTags(
  tags: string[] | undefined,
  targets: OverlayArtworkTarget[]
): string[] {
  const ordinaryTags = (tags ?? []).filter(
    (tag) => !TARGET_TAGS.has(tag.trim().toLowerCase())
  );
  const normalizedTargets = targets.length > 0 ? targets : ['main'];
  return [
    ...ordinaryTags,
    ...Array.from(new Set(normalizedTargets)).map(
      (target) => `${TARGET_TAG_PREFIX}${target}`
    ),
  ];
}
