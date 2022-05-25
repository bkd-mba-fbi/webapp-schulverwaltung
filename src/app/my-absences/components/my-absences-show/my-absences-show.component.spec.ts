import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';

import { MyAbsencesShowComponent } from './my-absences-show.component';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { MyAbsencesService } from '../../services/my-absences.service';
import { MyAbsencesReportLinkComponent } from '../my-absences-report-link/my-absences-report-link.component';
import { StorageService } from 'src/app/shared/services/storage.service';

describe('MyAbsencesShowComponent', () => {
  let component: MyAbsencesShowComponent;
  let fixture: ComponentFixture<MyAbsencesShowComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule(
        buildTestModuleMetadata({
          declarations: [
            MyAbsencesShowComponent,
            MyAbsencesReportLinkComponent,
          ],
          providers: [
            {
              provide: MyAbsencesService,
              useValue: {
                openAbsences$: of([]),
                openLessonAbsences$: of([]),
                counts$: of({}),
              },
            },
            {
              provide: StorageService,
              useValue: {
                getPayload(): Option<object> {
                  return { id_person: '42' };
                },
              },
            },
          ],
        })
      ).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAbsencesShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
