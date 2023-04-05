import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubAppModalComponent } from './sub-app-modal.component';

describe('SubAppModalComponent', () => {
  let component: SubAppModalComponent;
  let fixture: ComponentFixture<SubAppModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubAppModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubAppModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
