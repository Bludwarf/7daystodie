import {DescribePipe} from './describe.pipe';
import {TestBed} from '@angular/core/testing';
import {LocalizationService} from '../localization/localization.service';

describe('DescribePipe', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('create an instance', () => {
    const pipe = new DescribePipe(TestBed.get(LocalizationService));
    expect(pipe).toBeTruthy();
  });
});
