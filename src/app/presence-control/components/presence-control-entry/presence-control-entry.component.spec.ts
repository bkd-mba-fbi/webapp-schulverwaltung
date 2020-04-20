import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { buildLessonPresence } from 'src/spec-builders';
import {
  buildTestModuleMetadata,
  changeInput,
  settings,
} from 'src/spec-helpers';
import { PresenceControlEntry } from '../../models/presence-control-entry.model';
import { PresenceControlEntryComponent } from './presence-control-entry.component';

describe('PresenceControlEntryComponent', () => {
  let component: PresenceControlEntryComponent;
  let fixture: ComponentFixture<PresenceControlEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [PresenceControlEntryComponent],
      })
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresenceControlEntryComponent);
    component = fixture.componentInstance;
    changeInput(component, 'entry', buildPresenceControlEntry());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

function buildPresenceControlEntry(): PresenceControlEntry {
  const presenceControlEntry = new PresenceControlEntry(
    buildLessonPresence(
      1,
      new Date(2019, 1, 1, 15, 0),
      new Date(2019, 1, 1, 16, 0),
      'Physik',
      'Marie Curie'
    ),
    null
  );

  Object.defineProperty(presenceControlEntry, 'settings', {
    get: () => settings,
  });
  return presenceControlEntry;
}
