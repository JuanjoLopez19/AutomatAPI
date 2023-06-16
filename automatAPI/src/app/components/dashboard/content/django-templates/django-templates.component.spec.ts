import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DjangoTemplatesComponent } from './django-templates.component';

describe('DjangoTemplatesComponent', () => {
  let component: DjangoTemplatesComponent;
  let fixture: ComponentFixture<DjangoTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DjangoTemplatesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DjangoTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
