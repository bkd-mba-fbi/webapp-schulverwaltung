import { ComponentFixture, TestBed } from '@angular/core/testing';
import { buildStudent } from 'src/spec-builders';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { expectText } from 'src/specs/expectations';
import { DossierHeaderComponent } from './dossier-header.component';

describe('DossierHeaderComponent', () => {
  let component: DossierHeaderComponent;
  let fixture: ComponentFixture<DossierHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [DossierHeaderComponent],
      })
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DossierHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create dossier header for student', () => {
    // given
    component.studentId = 333;
    component.student = buildStudent(component.studentId);
    fixture.detectChanges();

    // then
    expectText(
      fixture.debugElement,
      'dossier-header-student',
      'T. Tux (F) 10.07.2002'
    );
  });
});
