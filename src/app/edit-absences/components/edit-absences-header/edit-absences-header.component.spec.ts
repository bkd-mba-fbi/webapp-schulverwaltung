import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { EditAbsencesHeaderComponent } from './edit-absences-header.component';
import { EditAbsencesStateService } from '../../services/edit-absences-state.service';

describe('EditAbsencesHeaderComponent', () => {
  let component: EditAbsencesHeaderComponent;
  let fixture: ComponentFixture<EditAbsencesHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [EditAbsencesHeaderComponent],
        providers: [
          {
            provide: EditAbsencesStateService,
            useValue: {
              absenceConfirmationStates$: of([]),
              presenceTypes$: of([]),
              selected: [{ lessonIds: [1, 2, 3], personIds: [4, 5, 6] }],
              removeSelectedEntries: jasmine.createSpy('removeSelectedEntries'),
            },
          },
        ],
      })
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAbsencesHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
