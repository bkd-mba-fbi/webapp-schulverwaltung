import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { LessonPresence } from 'src/app/shared/models/lesson-presence.model';
import { buildLessonPresence } from 'src/spec-builders';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { EditAbsencesStateService } from '../../services/edit-absences-state.service';
import { EditAbsencesListComponent } from './edit-absences-list.component';

describe('EditAbsencesListComponent', () => {
  let fixture: ComponentFixture<EditAbsencesListComponent>;
  let element: HTMLElement;
  let stateServiceMock: EditAbsencesStateService;
  let lessonPresence: LessonPresence;

  beforeEach(async(() => {
    lessonPresence = buildLessonPresence(
      5837_4508,
      new Date('2019-08-12T14:35:00'),
      new Date('2019-08-12T15:20:00'),
      '2-1-Biologie-MNW-2019/20-22a'
    );

    stateServiceMock = ({
      entries$: of([lessonPresence])
    } as unknown) as EditAbsencesStateService;

    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [EditAbsencesListComponent],
        providers: [
          { provide: EditAbsencesStateService, useValue: stateServiceMock }
        ]
      })
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAbsencesListComponent);
    element = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should show the result table', () => {
    expect(element.querySelectorAll('table').length).toBe(1);
  });
});
