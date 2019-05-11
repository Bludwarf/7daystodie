import {DescribePipe} from './describe.pipe';
import {TestBed} from '@angular/core/testing';
import {LocalizationService} from '../localization/localization.service';
import {DomSanitizer} from '@angular/platform-browser';

describe('DescribePipe', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('create an instance', () => {
    const pipe = new DescribePipe(TestBed.get(LocalizationService, DomSanitizer));
    expect(pipe).toBeTruthy();
  });
});
