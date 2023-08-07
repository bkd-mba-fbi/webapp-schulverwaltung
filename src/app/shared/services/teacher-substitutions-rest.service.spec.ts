import { TestBed } from '@angular/core/testing';

import { TeacherSubstitutionsRestService } from './teacher-substitutions-rest.service';
import { buildTestModuleMetadata } from '../../../spec-helpers';
import { HttpTestingController } from '@angular/common/http/testing';
import { TeacherSubstitution } from '../models/teacher-substitution.model';

describe('TeacherSubstitutionsRestService', () => {
  let service: TeacherSubstitutionsRestService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(TeacherSubstitutionsRestService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('getTeacherSubstitution', () => {
    it('should get the teacher substitution for the given id', () => {
      const subscriptionId = 34;
      const teacherSubscription = {
        Id: subscriptionId,
        Holder: 'Marie Curie',
      } as TeacherSubstitution;

      service
        .getTeacherSubstitution(subscriptionId)
        .subscribe((response) => expect(response).toEqual(teacherSubscription));

      httpTestingController
        .expectOne('https://eventotest.api/TeacherSubstitutions/?filter.Id==34')
        .flush([teacherSubscription]);
    });

    it('should return null for a non existing id', () => {
      const subscriptionId = 999;

      service
        .getTeacherSubstitution(subscriptionId)
        .subscribe((response) => expect(response).toBeNull());

      httpTestingController
        .expectOne(
          'https://eventotest.api/TeacherSubstitutions/?filter.Id==999'
        )
        .flush([]);
    });
  });
});
