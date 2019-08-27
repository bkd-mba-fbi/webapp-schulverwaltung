import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { EditAbsencesEditComponent } from './edit-absences-edit.component';
import { EditAbsencesStateService } from '../../services/edit-absences-state.service';

describe('EditAbsencesEditComponent', () => {
  let component: EditAbsencesEditComponent;
  let fixture: ComponentFixture<EditAbsencesEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [EditAbsencesEditComponent],
        providers: [
          {
            provide: EditAbsencesStateService,
            useValue: {
              presenceTypes$: of([]),
              selected: [{ lessonIds: [1, 2, 3], personIds: [4, 5, 6] }],
              resetSelection: jasmine.createSpy('resetSelection')
            }
          }
        ]
      })
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAbsencesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
