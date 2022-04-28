import { ComponentFixture, TestBed } from '@angular/core/testing';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { DossierStateService } from '../../services/dossier-state.service';

import { DossierAddressesComponent } from './dossier-addresses.component';

describe('DossierAddressesComponent', () => {
  let component: DossierAddressesComponent;
  let fixture: ComponentFixture<DossierAddressesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [DossierAddressesComponent],
        providers: [DossierStateService],
      })
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DossierAddressesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
