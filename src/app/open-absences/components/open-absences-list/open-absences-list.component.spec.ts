import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { OpenAbsencesListComponent } from './open-absences-list.component';
import { OpenAbsencesService } from '../../services/open-absences.service';
import { OpenAbsencesEntry } from '../../models/open-absences-entry.model';
import { buildLessonPresenceWithIds } from 'src/spec-builders';

describe('OpenAbsencesListComponent', () => {
  let component: OpenAbsencesListComponent;
  let fixture: ComponentFixture<OpenAbsencesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [OpenAbsencesListComponent],
        providers: [OpenAbsencesService]
      })
    ).compileComponents();
  }));

  afterEach(() => jasmine.clock().uninstall());

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(2000, 0, 23, 8, 30));

    fixture = TestBed.createComponent(OpenAbsencesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('.getDaysDifferenceKey', () => {
    it('it returns key for today', () => {
      const result = component.getDaysDifferenceKey(
        new OpenAbsencesEntry([
          buildLessonPresenceWithIds(1, 2, new Date(2000, 0, 23))
        ])
      );
      expect(result).toBe('open-absences.list.content.daysDifference.today');
    });

    it('it returns key for tomorrow', () => {
      const result = component.getDaysDifferenceKey(
        new OpenAbsencesEntry([
          buildLessonPresenceWithIds(1, 2, new Date(2000, 0, 24))
        ])
      );
      expect(result).toBe('open-absences.list.content.daysDifference.tomorrow');
    });

    it('it returns key for yesterday', () => {
      const result = component.getDaysDifferenceKey(
        new OpenAbsencesEntry([
          buildLessonPresenceWithIds(1, 2, new Date(2000, 0, 22))
        ])
      );
      expect(result).toBe(
        'open-absences.list.content.daysDifference.yesterday'
      );
    });

    it('it returns key for past date', () => {
      const result = component.getDaysDifferenceKey(
        new OpenAbsencesEntry([
          buildLessonPresenceWithIds(1, 2, new Date(2000, 0, 1))
        ])
      );
      expect(result).toBe('open-absences.list.content.daysDifference.ago');
    });

    it('it returns key for future date', () => {
      const result = component.getDaysDifferenceKey(
        new OpenAbsencesEntry([
          buildLessonPresenceWithIds(1, 2, new Date(2000, 0, 31))
        ])
      );
      expect(result).toBe('open-absences.list.content.daysDifference.in');
    });
  });
});
