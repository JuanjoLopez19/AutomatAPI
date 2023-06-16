import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpressTemplatesComponent } from './express-templates.component';

describe('ExpressTemplatesComponent', () => {
  let component: ExpressTemplatesComponent;
  let fixture: ComponentFixture<ExpressTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExpressTemplatesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpressTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
