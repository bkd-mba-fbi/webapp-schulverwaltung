import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { EditAbsencesComponent } from './edit-absences.component';
import { EditAbsencesHeaderComponent } from '../edit-absences-header/edit-absences-header.component';
import { EditAbsencesListComponent } from '../edit-absences-list/edit-absences-list.component';

describe('EditAbsencesComponent', () => {
  let component: EditAbsencesComponent;
  let fixture: ComponentFixture<EditAbsencesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [
          EditAbsencesComponent,
          EditAbsencesHeaderComponent,
          EditAbsencesListComponent,
        ],
      })
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAbsencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
