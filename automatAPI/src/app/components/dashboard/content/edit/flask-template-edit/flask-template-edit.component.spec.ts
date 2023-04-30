import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlaskTemplateEditComponent } from './flask-template-edit.component';

describe('FlaskTemplateEditComponent', () => {
  let component: FlaskTemplateEditComponent;
  let fixture: ComponentFixture<FlaskTemplateEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlaskTemplateEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlaskTemplateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
