import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { expectText } from 'src/specs/expectations';
import { DossierGradesViewComponent } from './dossier-grades-view.component';
import { DossierGradesService } from '../../../services/dossier-grades.service';
import { StorageService } from '../../../services/storage.service';

describe('DossierGradesViewComponent', () => {
  let component: DossierGradesViewComponent;
  let fixture: ComponentFixture<DossierGradesViewComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [DossierGradesViewComponent],
        providers: [
          DossierGradesService,
          StorageService,
          {
            provide: StorageService,
            useValue: {
              getPayload(): Option<object> {
                return { id_person: 42 };
              },
            },
          },
        ],
      })
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DossierGradesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    debugElement = fixture.debugElement;
  });

  it('should show message that indicates that there are no courses', () => {
    component.courses = [];

    fixture.detectChanges();

    expectText(debugElement, 'message-no-courses', 'dossier.no-courses');
  });
});
