import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { StudentProfileComponent } from './student-profile.component';
import { StudentBacklinkComponent } from '../student-backlink/student-backlink.component';
import { STUDENT_PROFILE_BACKLINK } from '../../tokens/student-profile-backlink';

describe('StudentProfileComponent', () => {
  let component: StudentProfileComponent;
  let fixture: ComponentFixture<StudentProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [StudentProfileComponent, StudentBacklinkComponent],
        providers: [{ provide: STUDENT_PROFILE_BACKLINK, useValue: '/' }],
      })
    ).compileComponents();
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
