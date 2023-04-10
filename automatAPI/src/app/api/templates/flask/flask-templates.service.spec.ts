import { TestBed } from '@angular/core/testing';

import { FlaskTemplatesService } from './flask-templates.service';

describe('FlaskTemplatesService', () => {
  let service: FlaskTemplatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlaskTemplatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
