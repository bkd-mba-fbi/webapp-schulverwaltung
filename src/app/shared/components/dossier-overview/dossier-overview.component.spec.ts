import { ComponentFixture, TestBed } from '@angular/core/testing';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { DossierStateService } from '../../services/dossier-state.service';

import { DossierOverviewComponent } from './dossier-overview.component';

describe('DossierOverviewComponent', () => {
  let component: DossierOverviewComponent;
  let fixture: ComponentFixture<DossierOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [DossierOverviewComponent],
        providers: [DossierStateService],
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
