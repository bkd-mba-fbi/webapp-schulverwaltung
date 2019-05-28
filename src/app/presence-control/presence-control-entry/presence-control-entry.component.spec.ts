import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresenceControlEntryComponent } from './presence-control-entry.component';
import { buildTestModuleMetadata, changeInput } from 'src/spec-helpers';
import {
  buildLessonPresence,
  buildPresenceControlEntry
} from 'src/spec-builders';
import { StorageService } from 'src/app/shared/services/storage.service';

describe('PresenceControlEntryComponent', () => {
  let component: PresenceControlEntryComponent;
  let fixture: ComponentFixture<PresenceControlEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [PresenceControlEntryComponent],
        providers: [
          {
            provide: StorageService,
            useValue: {
              getAccessToken(): string {
                return 'asdf';
              }
            }
          }
        ]
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

  describe('.avatarStyles$', () => {
    it('emits styles object with avatar image and fallback', () => {
      component.avatarStyles$.subscribe(styles =>
        expect(styles).toEqual({
          'background-image':
            'url(https://eventotest.api/Files/personPictures/123?token=asdf), url(assets/images/avatar-placeholder.png)'
        })
      );
    });
  });
});
