import { TestBed } from '@angular/core/testing';

import { DjangoTemplatesService } from './django-templates.service';

describe('DjangoTemplatesService', () => {
  let service: DjangoTemplatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DjangoTemplatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
