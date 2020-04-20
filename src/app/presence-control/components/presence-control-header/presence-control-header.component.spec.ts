import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresenceControlHeaderComponent } from './presence-control-header.component';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { buildReference } from 'src/spec-builders';

describe('PresenceControlHeaderComponent', () => {
  let component: PresenceControlHeaderComponent;
  let fixture: ComponentFixture<PresenceControlHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [PresenceControlHeaderComponent],
      })
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresenceControlHeaderComponent);
    component = fixture.componentInstance;
    component.lesson = {
      LessonRef: buildReference(),
      EventDesignation: 'Deutsch',
      StudyClassNumber: 'DHF2018a',
      LessonDateTimeFrom: new Date(),
      LessonDateTimeTo: new Date(),
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
