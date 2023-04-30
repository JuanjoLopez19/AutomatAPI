import { TestBed } from '@angular/core/testing';

import { ExpressTemplatesService } from '../express/express-templates.service';

describe('ExpressTemplatesService', () => {
  let service: ExpressTemplatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpressTemplatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
