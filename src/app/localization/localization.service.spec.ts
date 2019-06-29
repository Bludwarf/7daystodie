import { TestBed } from '@angular/core/testing';

import { LocalizationService } from './localization.service';
import {ItemsService} from '../items/items.service';

describe('LocalizationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocalizationService = TestBed.get(LocalizationService);
    expect(service).toBeTruthy();
  });

  it('should translate using DescriptionKey', () => {
    const service: LocalizationService = TestBed.get(LocalizationService);
    const items: ItemsService = TestBed.get(ItemsService);
    const item = items.get('vehicleMinibikePlaceable');
    expect(service.describe(item)).toBe(service.translate('vehiclePlaceableGroupDesc'));
  });

  it('should translate using extended DescriptionKey', () => {
    const service: LocalizationService = TestBed.get(LocalizationService);
    const items: ItemsService = TestBed.get(ItemsService);
    const item = items.get('vehicleMinibikeHandlebars');
    expect(service.describe(item)).toBe(service.translate('vehiclePartsGroupDesc'));
  });

  it('should translate even without DescriptionKey', () => {
    const service: LocalizationService = TestBed.get(LocalizationService);
    const items: ItemsService = TestBed.get(ItemsService);
    const item = items.get('partsMaster');
    expect(service.describe(item)).toBe(service.translate('partsMaster'));
  });
});
