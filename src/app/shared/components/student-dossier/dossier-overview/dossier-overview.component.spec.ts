import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DossierStateService } from 'src/app/shared/services/dossier-state.service';
import { buildTestModuleMetadata } from 'src/spec-helpers';
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
