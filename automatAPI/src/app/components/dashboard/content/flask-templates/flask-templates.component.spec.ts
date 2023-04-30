import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlaskTemplatesComponent } from './flask-templates.component';

describe('FlaskTemplatesComponent', () => {
  let component: FlaskTemplatesComponent;
  let fixture: ComponentFixture<FlaskTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlaskTemplatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlaskTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
