import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { StudentProfileComponent } from './student-profile.component';
import { StudentBacklinkComponent } from '../student-backlink/student-backlink.component';
import { StudentProfileAddressComponent } from '../student-profile-address/student-profile-address.component';
import { StudentProfileEntryHeaderComponent } from '../student-profile-entry-header/student-profile-entry-header.component';
import { STUDENT_PROFILE_BACKLINK } from '../../tokens/student-profile-backlink';
import { DossierStateService } from '../../services/dossier-state.service';

describe('StudentProfileComponent', () => {
  let component: StudentProfileComponent;
  let fixture: ComponentFixture<StudentProfileComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule(
        buildTestModuleMetadata({
          declarations: [StudentProfileComponent],
          providers: [
            { provide: STUDENT_PROFILE_BACKLINK, useValue: '/' },
            DossierStateService,
          ],
        })
      ).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
