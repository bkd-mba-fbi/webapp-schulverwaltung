import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  buildLessonPresence,
  buildPresenceControlEntry
} from 'src/spec-builders';
import { buildTestModuleMetadata, changeInput } from 'src/spec-helpers';
import { PresenceControlEntryComponent } from './presence-control-entry.component';

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
    changeInput(
      component,
      'entry',
      buildPresenceControlEntry(lessonPresence, null)
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
