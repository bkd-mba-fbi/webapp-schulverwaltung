import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DossierStateService } from 'src/app/shared/services/dossier-state.service';
import { buildTestModuleMetadata } from 'src/spec-helpers';

import { DossierGradesComponent } from './dossier-grades.component';

describe('StudentGradesComponent', () => {
  let component: DossierGradesComponent;
  let fixture: ComponentFixture<DossierGradesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [DossierGradesComponent],
        providers: [DossierStateService],
      })
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DossierGradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
