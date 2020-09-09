import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAbsencesReportComponent } from './my-absences-report.component';
import { buildTestModuleMetadata } from 'src/spec-helpers';

describe('MyAbsencesReportComponent', () => {
  let component: MyAbsencesReportComponent;
  let fixture: ComponentFixture<MyAbsencesReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [MyAbsencesReportComponent],
      })
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAbsencesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
