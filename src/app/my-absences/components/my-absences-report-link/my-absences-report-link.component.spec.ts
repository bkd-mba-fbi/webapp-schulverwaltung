import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyAbsencesReportLinkComponent } from '../my-absences-report-link/my-absences-report-link.component';
import { buildTestModuleMetadata } from 'src/spec-helpers';

describe('MyAbsencesEditLinkComponent', () => {
  let component: MyAbsencesReportLinkComponent;
  let fixture: ComponentFixture<MyAbsencesReportLinkComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule(
        buildTestModuleMetadata(
          buildTestModuleMetadata({
            declarations: [MyAbsencesReportLinkComponent],
          })
        )
      ).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAbsencesReportLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
