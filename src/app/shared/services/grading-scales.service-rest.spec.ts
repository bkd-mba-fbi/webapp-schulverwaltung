import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { GradingScale } from '../models/grading-scale.model';

import { GradingScalesRestService } from './grading-scales-rest.service';

describe('GradingScalesRestService', () => {
  let service: GradingScalesRestService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(GradingScalesRestService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should request a grading scale by id', () => {
    const data: GradingScale = {} as GradingScale;

    service
      .getGradingScale(1234)
      .subscribe((result) => expect(result).toEqual(data));

    httpTestingController
      .expectOne(
        ({ url }) => url === 'https://eventotest.api/GradingScales/1234'
      )
      .flush(data);
  });
});
