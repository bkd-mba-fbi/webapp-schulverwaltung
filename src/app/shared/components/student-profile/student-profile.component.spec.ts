import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { StudentProfileComponent } from './student-profile.component';
import { StudentBacklinkComponent } from '../student-backlink/student-backlink.component';
import { StudentProfileAddressComponent } from '../student-profile-address/student-profile-address.component';
import { StudentProfileEntryHeaderComponent } from '../student-profile-entry-header/student-profile-entry-header.component';
import { StudentProfileLegalRepresentativeComponent } from '../student-profile-legal-representative/student-profile-legal-representative.component';
import { StudentProfileApprenticeshipCompanyComponent } from '../student-profile-apprenticeship-company/student-profile-apprenticeship-company.component';
import { STUDENT_PROFILE_BACKLINK } from '../../tokens/student-profile-backlink';
import { StudentProfileAbsencesService } from '../../services/student-profile-absences.service';

describe('StudentProfileComponent', () => {
  let component: StudentProfileComponent;
  let fixture: ComponentFixture<StudentProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [
          StudentProfileComponent,
          StudentBacklinkComponent,
          StudentProfileEntryHeaderComponent,
          StudentProfileAddressComponent,
          StudentProfileLegalRepresentativeComponent,
          StudentProfileApprenticeshipCompanyComponent,
        ],
        providers: [{ provide: STUDENT_PROFILE_BACKLINK, useValue: '/' }],
      })
    )
      .overrideComponent(StudentProfileComponent, {
        set: {
          providers: [
            {
              provide: StudentProfileAbsencesService,
              useValue: {
                openAbsences$: of([]),
                openAbsencesCount$: of(null),
                setStudentId: jasmine.createSpy('setStudentId'),
              },
            },
          ],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
