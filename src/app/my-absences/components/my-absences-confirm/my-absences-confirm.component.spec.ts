import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { MyAbsencesConfirmComponent } from './my-absences-confirm.component';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { MyAbsencesService } from '../../services/my-absences.service';
import { ConfirmAbsencesSelectionService } from 'src/app/shared/services/confirm-absences-selection.service';

describe('MyAbsencesConfirmComponent', () => {
  let component: MyAbsencesConfirmComponent;
  let fixture: ComponentFixture<MyAbsencesConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [MyAbsencesConfirmComponent],
        providers: [
          {
            provide: MyAbsencesService,
            useValue: {
              openAbsences$: of([]),
              counts$: of({}),
            },
          },
          {
            provide: ConfirmAbsencesSelectionService,
            useValue: {
              selectedIds$: of([{ lessonIds: [1], personIds: [1] }]),
            },
          },
        ],
      })
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAbsencesConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
