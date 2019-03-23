import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeNodeComponent } from './recipe-node.component';

describe('RecipeNodeComponent', () => {
  let component: RecipeNodeComponent;
  let fixture: ComponentFixture<RecipeNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipeNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
