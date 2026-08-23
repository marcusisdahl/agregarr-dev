import { describe, expect, it, vi } from 'vitest';
import {
  getOverlayTargets,
  isOverlayCompatibleWithLibrary,
  setOverlayTargetTags,
  targetsArtwork,
} from './overlayTargets';
import { PRESET_TEMPLATES } from './PresetTemplates';

vi.mock('@server/datasource', () => ({ getRepository: vi.fn() }));

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

  it('hides child-artwork templates from movie libraries', () => {
    expect(isOverlayCompatibleWithLibrary(['target:season'], 'movie')).toBe(
      false
    );
    expect(isOverlayCompatibleWithLibrary(['target:episode'], 'movie')).toBe(
      false
    );
    expect(isOverlayCompatibleWithLibrary(['target:main'], 'movie')).toBe(true);
    expect(isOverlayCompatibleWithLibrary(['target:episode'], 'show')).toBe(
      true
    );
  });

  it('ships correctly-sized season and episode IMDb presets', () => {
    const season = PRESET_TEMPLATES.find(
      (preset) => preset.name === 'IMDb Rating - Season Poster'
    );
    const episode = PRESET_TEMPLATES.find(
      (preset) => preset.name === 'IMDb Rating - Episode Card'
    );

    expect(season?.tags).toContain('target:season');
    expect(season?.templateData).toMatchObject({ width: 1000, height: 1500 });
    expect(episode?.tags).toContain('target:episode');
    expect(episode?.templateData).toMatchObject({ width: 1920, height: 1080 });
  });
});
