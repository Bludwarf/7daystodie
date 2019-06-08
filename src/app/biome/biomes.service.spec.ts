import { TestBed } from '@angular/core/testing';

import { BiomesService } from './biomes.service';

describe('BiomesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BiomesService = TestBed.get(BiomesService);
    expect(service).toBeTruthy();
  });

  function expectBiomeInfo(biome) {
    expect(biome.layers.length).toEqual(7);

    const snowLayer = biome.layers[0];
    expect(snowLayer.blockname).toBe('terrSnow');
    expect(snowLayer.elevation.max).toBe(0);
    expect(snowLayer.elevation.min).toBe(-3);

    const dirtLayer = biome.layers[1];
    expect(dirtLayer.blockname).toBe('terrDirt');
    expect(dirtLayer.elevation.max).toBe(-3);
    expect(dirtLayer.elevation.min).toBe(-5);

    const middle = biome.layers[2];
    expect(middle.elevation.max).toBe(-5);
    expect(middle.elevation.min).toBe(15);

    const stoneLayer = biome.layers[biome.layers.length - 2];
    expect(stoneLayer.elevation.max).toBe(4);
    expect(stoneLayer.elevation.min).toBe(3);

    const bedrockLayer = biome.layers[biome.layers.length - 1];
    expect(bedrockLayer.elevation.max).toBe(3);
    expect(bedrockLayer.elevation.min).toBe(0);
  }

  it('should get surface layer info from biome', () => {
    const service: BiomesService = TestBed.get(BiomesService);
    const biome = service.get('snow');
    expectBiomeInfo(biome);
  });

  it('should get surface layer info from subbiome', () => {
    const service: BiomesService = TestBed.get(BiomesService);
    const subBiome = service.get('snow').subBiomes[0];
    expectBiomeInfo(subBiome);
  });

  it('should get resource occurences', () => {
    const service: BiomesService = TestBed.get(BiomesService);
    const resourceOccurences = service.getResourceOccurences('terrOreGravelPlusPotassium');
    expect(resourceOccurences.length).toBe(37);
  });
});
