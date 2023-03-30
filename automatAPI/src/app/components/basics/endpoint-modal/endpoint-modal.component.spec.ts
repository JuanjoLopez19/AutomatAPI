import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndpointModalComponent } from './endpoint-modal.component';

describe('EndpointModalComponent', () => {
  let component: EndpointModalComponent;
  let fixture: ComponentFixture<EndpointModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EndpointModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EndpointModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
