import { ComponentFixture, TestBed } from '@angular/core/testing';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { DossierStateService } from '../../services/dossier-state.service';

import { DossierAbsencesComponent } from './dossier-absences.component';

describe('DossierAbsencesComponent', () => {
  let component: DossierAbsencesComponent;
  let fixture: ComponentFixture<DossierAbsencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [DossierAbsencesComponent],
        providers: [DossierStateService],
      })
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DossierAbsencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
