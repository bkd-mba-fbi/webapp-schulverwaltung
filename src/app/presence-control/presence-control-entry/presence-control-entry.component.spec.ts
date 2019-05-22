import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresenceControlEntryComponent } from './presence-control-entry.component';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import {
  buildLessonPresence,
  buildPresenceControlEntry
} from 'src/spec-builders';

describe('PresenceControlEntryComponent', () => {
  let component: PresenceControlEntryComponent;
  let fixture: ComponentFixture<PresenceControlEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [PresenceControlEntryComponent]
      })
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresenceControlEntryComponent);
    component = fixture.componentInstance;
    const lessonPresence = buildLessonPresence(
      1,
      new Date(2019, 1, 1, 15, 0),
      new Date(2019, 1, 1, 16, 0),
      'Physik',
      'Marie Curie'
    );
    component.entry = buildPresenceControlEntry(lessonPresence, null);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
