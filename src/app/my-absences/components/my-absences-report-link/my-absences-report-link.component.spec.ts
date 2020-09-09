import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAbsencesReportLinkComponent } from '../my-absences-report-link/my-absences-report-link.component';
import { buildTestModuleMetadata } from 'src/spec-helpers';

describe('MyAbsencesEditLinkComponent', () => {
  let component: MyAbsencesReportLinkComponent;
  let fixture: ComponentFixture<MyAbsencesReportLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [MyAbsencesReportLinkComponent],
      })
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAbsencesReportLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
