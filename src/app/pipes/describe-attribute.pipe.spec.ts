import {DescribePipe} from './describe.pipe';
import {TestBed} from '@angular/core/testing';
import {LocalizationService} from '../localization/localization.service';
import {DomSanitizer} from '@angular/platform-browser';
import {DescribeAttributePipe} from './describe-attribute.pipe';

describe('DescribeAttributePipe', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('create an instance', () => {
    const pipe = new DescribeAttributePipe(TestBed.get(LocalizationService), TestBed.get(DomSanitizer));
    expect(pipe).toBeTruthy();
  });
});
