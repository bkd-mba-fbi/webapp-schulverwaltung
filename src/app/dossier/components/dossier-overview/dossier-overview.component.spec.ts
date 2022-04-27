import { ComponentFixture, TestBed } from '@angular/core/testing';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { DossierSectionLinkComponent } from '../dossier-section-link/dossier-section-link.component';

import { DossierOverviewComponent } from './dossier-overview.component';

describe('DossierOverviewComponent', () => {
  let component: DossierOverviewComponent;
  let fixture: ComponentFixture<DossierOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [DossierOverviewComponent, DossierSectionLinkComponent],
      })
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DossierOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
