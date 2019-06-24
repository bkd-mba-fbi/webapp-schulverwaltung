import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { OpenAbsencesEditComponent } from './open-absences-edit.component';
import { OpenAbsencesService } from '../../services/open-absences.service';

describe('OpenAbsencesEditComponent', () => {
  let component: OpenAbsencesEditComponent;
  let fixture: ComponentFixture<OpenAbsencesEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [OpenAbsencesEditComponent],
        providers: [OpenAbsencesService]
      })
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenAbsencesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
