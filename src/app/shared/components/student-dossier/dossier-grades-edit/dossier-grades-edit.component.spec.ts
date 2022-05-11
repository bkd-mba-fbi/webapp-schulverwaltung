import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { buildTest } from 'src/spec-builders';
import { buildTestModuleMetadata } from 'src/spec-helpers';

import { DossierGradesEditComponent } from './dossier-grades-edit.component';

describe('DossierGradesEditComponent', () => {
  let component: DossierGradesEditComponent;
  let fixture: ComponentFixture<DossierGradesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [DossierGradesEditComponent],
        providers: [NgbActiveModal],
      })
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DossierGradesEditComponent);
    component = fixture.componentInstance;
    component.test = buildTest(1, 1, []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
