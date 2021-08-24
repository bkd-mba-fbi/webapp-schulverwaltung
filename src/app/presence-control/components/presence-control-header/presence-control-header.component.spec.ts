import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PresenceControlHeaderComponent } from './presence-control-header.component';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { buildReference } from 'src/spec-builders';
import { fromLesson } from '../../models/lesson-entry.model';
import { PresenceControlStateService } from '../../services/presence-control-state.service';
import { PresenceControlGroupService } from '../../services/presence-control-group.service';

describe('PresenceControlHeaderComponent', () => {
  let component: PresenceControlHeaderComponent;
  let fixture: ComponentFixture<PresenceControlHeaderComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule(
        buildTestModuleMetadata({
          declarations: [PresenceControlHeaderComponent],
          providers: [PresenceControlStateService, PresenceControlGroupService],
        })
      ).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PresenceControlHeaderComponent);
    component = fixture.componentInstance;

    const lesson = {
      LessonRef: buildReference(),
      EventDesignation: 'Deutsch',
      EventRef: buildReference(),
      StudyClassNumber: 'DHF2018a',
      TeacherInformation: 'Monika Muster',
      LessonDateTimeFrom: new Date(),
      LessonDateTimeTo: new Date(),
    };

    const lessonEntry = fromLesson(lesson);

    component.lessons = [lessonEntry];
    component.selectedLesson = lessonEntry;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
