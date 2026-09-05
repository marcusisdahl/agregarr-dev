import type { OverlayTemplateData } from '@server/entity/OverlayTemplate';
import { describe, expect, it } from 'vitest';
import {
  calculateOverlayInputHash,
  extractMappedIconFields,
} from './metadataHashing';

describe('overlay input hashing', () => {
  it('regenerates artwork when output quality changes', () => {
    const base = {
      templateIds: [],
      templateData: [],
      usedFields: new Set<string>(),
      context: {},
    };

    const quality95 = calculateOverlayInputHash({
      ...base,
      renderOptions: { format: 'jpeg', jpegQuality: 95 },
    });
    const quality100 = calculateOverlayInputHash({
      ...base,
      renderOptions: { format: 'jpeg', jpegQuality: 100 },
    });

    expect(quality95).not.toBe(quality100);
  });

  it('regenerates artwork when an effective mapped icon changes', () => {
    const templateData = [
      {
        width: 1000,
        height: 1500,
        elements: [
          {
            id: 'audio',
            layerOrder: 0,
            type: 'mapped-icon' as const,
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            properties: {
              field: 'audioLanguages',
              mappings: [],
              layout: 'horizontal' as const,
              iconSize: 32,
              spacingX: 4,
              spacingY: 4,
            },
          },
        ],
      },
    ] satisfies OverlayTemplateData[];
    const base = {
      templateIds: [1],
      templateData,
      usedFields: new Set(['audioLanguages']),
      context: { audioLanguages: ['eng'] },
      renderOptions: { format: 'jpeg', jpegQuality: 95 },
    };

    const before = calculateOverlayInputHash({
      ...base,
      mappedIconMappings: {
        audioLanguages: [{ value: 'eng', iconPath: '/icons/old.svg' }],
      },
    });
    const after = calculateOverlayInputHash({
      ...base,
      mappedIconMappings: {
        audioLanguages: [{ value: 'eng', iconPath: '/icons/new.svg' }],
      },
    });

    expect(before).not.toBe(after);
    expect(extractMappedIconFields(templateData)).toEqual(
      new Set(['audioLanguages'])
    );
  });

  it('normalizes mapped-icon ordering without dropping render options', () => {
    const base = {
      templateIds: [],
      templateData: [],
      usedFields: new Set<string>(),
      context: {},
      renderOptions: { format: 'jpeg', jpegQuality: 95 },
    };
    const first = calculateOverlayInputHash({
      ...base,
      mappedIconMappings: {
        audioLanguages: [
          { value: 'eng', iconPath: '/icons/en.svg' },
          { value: 'fra', iconPath: '/icons/fr.svg' },
        ],
      },
    });
    const reordered = calculateOverlayInputHash({
      ...base,
      mappedIconMappings: {
        audioLanguages: [
          { value: 'fra', iconPath: '/icons/fr.svg' },
          { value: 'eng', iconPath: '/icons/en.svg' },
        ],
      },
    });
    const differentQuality = calculateOverlayInputHash({
      ...base,
      renderOptions: { format: 'jpeg', jpegQuality: 90 },
      mappedIconMappings: {
        audioLanguages: [
          { value: 'eng', iconPath: '/icons/en.svg' },
          { value: 'fra', iconPath: '/icons/fr.svg' },
        ],
      },
    });

    expect(first).toBe(reordered);
    expect(first).not.toBe(differentQuality);
  });
});
