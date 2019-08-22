import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAbsencesHeaderComponent } from './edit-absences-header.component';
import { buildTestModuleMetadata } from 'src/spec-helpers';

describe('EditAbsencesHeaderComponent', () => {
  let component: EditAbsencesHeaderComponent;
  let fixture: ComponentFixture<EditAbsencesHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [EditAbsencesHeaderComponent]
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
