import { TranslatePipe } from './translate.pipe';
import {TestBed} from '@angular/core/testing';
import {LocalizationService} from '../services/config/localization.service';

describe('TranslatePipe', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('create an instance', () => {
    const pipe = new TranslatePipe(TestBed.get(LocalizationService));
    expect(pipe).toBeTruthy();
  });
});
