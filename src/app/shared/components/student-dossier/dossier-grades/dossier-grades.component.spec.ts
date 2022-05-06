import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DossierGradesService } from 'src/app/shared/services/dossier-grades.service';
import { DossierStateService } from 'src/app/shared/services/dossier-state.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { buildTestModuleMetadata } from 'src/spec-helpers';

import { DossierGradesComponent } from './dossier-grades.component';

describe('DossierGradesComponent', () => {
  let component: DossierGradesComponent;
  let fixture: ComponentFixture<DossierGradesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [DossierGradesComponent],
        providers: [
          DossierStateService,
          DossierGradesService,
          {
            provide: StorageService,
            useValue: jasmine.createSpyObj('StorageService', ['getPayload']),
          },
        ],
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
