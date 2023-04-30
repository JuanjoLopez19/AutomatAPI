import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpressTemplateEditComponent } from './express-template-edit.component';

describe('ExpressTemplateEditComponent', () => {
  let component: ExpressTemplateEditComponent;
  let fixture: ComponentFixture<ExpressTemplateEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpressTemplateEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpressTemplateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
