import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemModifierComponent } from './item-modifier.component';

describe('ItemModifierComponent', () => {
  let component: ItemModifierComponent;
  let fixture: ComponentFixture<ItemModifierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemModifierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemModifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
