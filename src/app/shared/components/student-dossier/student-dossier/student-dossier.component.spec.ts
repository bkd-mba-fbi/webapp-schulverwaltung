import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { StudentDossierComponent } from './student-dossier.component';
import { STUDENT_DOSSIER_BACKLINK } from '../../../tokens/student-dossier-backlink';
import { DossierStateService } from '../../../services/dossier-state.service';

describe('StudentDossierComponent', () => {
  let component: StudentDossierComponent;
  let fixture: ComponentFixture<StudentDossierComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule(
        buildTestModuleMetadata({
          declarations: [StudentDossierComponent],
          providers: [
            { provide: STUDENT_DOSSIER_BACKLINK, useValue: '/' },
            DossierStateService,
          ],
        })
      ).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentDossierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
