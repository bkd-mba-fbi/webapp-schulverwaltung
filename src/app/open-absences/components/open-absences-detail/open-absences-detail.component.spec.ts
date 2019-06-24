import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { OpenAbsencesDetailComponent } from './open-absences-detail.component';
import { OpenAbsencesService } from '../../services/open-absences.service';

describe('OpenAbsencesDetailComponent', () => {
  let component: OpenAbsencesDetailComponent;
  let fixture: ComponentFixture<OpenAbsencesDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [OpenAbsencesDetailComponent],
        providers: [OpenAbsencesService]
      })
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenAbsencesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
