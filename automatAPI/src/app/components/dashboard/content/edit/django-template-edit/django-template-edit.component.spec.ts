import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DjangoTemplateEditComponent } from './django-template-edit.component';

describe('DjangoTemplateEditComponent', () => {
  let component: DjangoTemplateEditComponent;
  let fixture: ComponentFixture<DjangoTemplateEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DjangoTemplateEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DjangoTemplateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
