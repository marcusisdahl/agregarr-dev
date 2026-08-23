import { describe, expect, it } from 'vitest';
import {
  getOverlayTargets,
  setOverlayTargetTags,
  targetsArtwork,
} from './overlayTargets';

describe('overlay artwork targets', () => {
  it('treats untagged legacy templates as main artwork', () => {
    expect(getOverlayTargets()).toEqual(['main']);
    expect(getOverlayTargets(['ratings'])).toEqual(['main']);
  });

  it('recognizes explicit targets without case sensitivity', () => {
    expect(getOverlayTargets(['target:Season', 'TARGET:EPISODE'])).toEqual([
      'season',
      'episode',
    ]);
    expect(targetsArtwork(['target:episode'], 'main')).toBe(false);
  });

  it('replaces target tags while preserving ordinary tags', () => {
    expect(
      setOverlayTargetTags(['ratings', 'target:main'], ['season', 'episode'])
    ).toEqual(['ratings', 'target:season', 'target:episode']);
  });
});
