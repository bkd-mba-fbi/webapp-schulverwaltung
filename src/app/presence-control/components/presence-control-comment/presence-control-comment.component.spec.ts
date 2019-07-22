import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { withConfig } from 'src/app/rest-error-interceptor';
import { LessonPresence } from 'src/app/shared/models/lesson-presence.model';
import { Lesson } from 'src/app/shared/models/lesson.model';
import { PresenceType } from 'src/app/shared/models/presence-type.model';
import { LessonPresencesUpdateRestService } from 'src/app/shared/services/lesson-presences-update-rest.service';
import {
  buildLesson,
  buildLessonPresence,
  buildPresenceControlEntry,
  buildPresenceType
} from 'src/spec-builders';
import { ActivatedRouteMock, buildTestModuleMetadata } from 'src/spec-helpers';
import { PresenceControlEntry } from '../../models/presence-control-entry.model';
import { PresenceControlStateService } from '../../services/presence-control-state.service';
import { PresenceControlBackComponent } from '../presence-control-back/presence-control-back.component';
import { PresenceControlCommentComponent } from './presence-control-comment.component';

describe('PresenceControlCommentComponent', () => {
  let component: PresenceControlCommentComponent;
  let fixture: ComponentFixture<PresenceControlCommentComponent>;

  let restServiceMock: LessonPresencesUpdateRestService;
  let stateServiceMock: PresenceControlStateService;
  let activatedRouteMock: ActivatedRouteMock;

  let lessonPresence: LessonPresence;
  let lesson: Lesson;
  let absence: PresenceType;
  let entry: PresenceControlEntry;

  beforeEach(async(() => {
    lessonPresence = buildLessonPresence(123, new Date(), new Date(), '');
    lessonPresence.PresenceComment = 'comment';
    lesson = buildLesson(133, new Date(), new Date(), '');
    absence = buildPresenceType(143, 11, 1, 0);
    entry = buildPresenceControlEntry(lessonPresence, absence);

    activatedRouteMock = new ActivatedRouteMock({
      studentId: lessonPresence.StudentRef.Id,
      lessonId: lesson.LessonRef.Id
    });

    stateServiceMock = ({
      getPresenceControlEntry: jasmine
        .createSpy('getPresenceControlEntry')
        .and.callFake(() => of(entry))
    } as unknown) as PresenceControlStateService;

    restServiceMock = ({
      editLessonPresences: jasmine
        .createSpy('editLessonPresences')
        .and.callFake(() => of())
    } as unknown) as LessonPresencesUpdateRestService;

    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [
          PresenceControlCommentComponent,
          PresenceControlBackComponent
        ],
        providers: [
          { provide: ActivatedRoute, useValue: activatedRouteMock },
          {
            provide: PresenceControlStateService,
            useValue: stateServiceMock
          },
          {
            provide: LessonPresencesUpdateRestService,
            useValue: restServiceMock
          }
        ]
      })
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresenceControlCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should update the comment', () => {
    component.onSubmit();
    expect(restServiceMock.editLessonPresences).toHaveBeenCalledWith(
      [lessonPresence.LessonRef.Id],
      [lessonPresence.StudentRef.Id],
      undefined,
      undefined,
      'comment',
      withConfig({ disableErrorHandling: true })
    );
  });
});
