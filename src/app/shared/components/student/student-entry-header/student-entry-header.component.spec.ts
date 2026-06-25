import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import {
  NgbAccordionBody,
  NgbAccordionCollapse,
  NgbAccordionDirective,
  NgbAccordionItem,
} from "@ng-bootstrap/ng-bootstrap";
import { buildTestModuleMetadata } from "../../../../../spec-helpers";
import { StudentEntryHeaderComponent } from "./student-entry-header.component";

@Component({
  template: `
    <div ngbAccordion>
      <div ngbAccordionItem>
        <bkd-student-entry-header>Test</bkd-student-entry-header>
        <div ngbAccordionCollapse>
          <div ngbAccordionBody><ng-template>Body</ng-template></div>
        </div>
      </div>
    </div>
  `,
  imports: [
    StudentEntryHeaderComponent,
    NgbAccordionDirective,
    NgbAccordionItem,
    NgbAccordionCollapse,
    NgbAccordionBody,
  ],
})
class HostComponent {}

describe("StudentEntryHeaderComponent", () => {
  let component: StudentEntryHeaderComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [HostComponent],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    component = fixture.debugElement.query(
      By.directive(StudentEntryHeaderComponent),
    ).componentInstance;
    fixture.detectChanges();
  });

  it("creates", () => {
    expect(component).toBeTruthy();
  });
});
