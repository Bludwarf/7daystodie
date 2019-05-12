import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiAtlasItemIconComponent } from './ui-atlas-item-icon.component';

describe('UiAtlasItemIconComponent', () => {
  let component: UiAtlasItemIconComponent;
  let fixture: ComponentFixture<UiAtlasItemIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiAtlasItemIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiAtlasItemIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
