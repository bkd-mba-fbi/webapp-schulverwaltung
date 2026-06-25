import { Component, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
  NgbAccordionBody,
  NgbAccordionCollapse,
  NgbAccordionDirective,
  NgbAccordionItem,
} from "@ng-bootstrap/ng-bootstrap";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StudentDossierEntryHeaderComponent } from "./student-dossier-entry-header.component";

@Component({
  template: `
    <div ngbAccordion>
      <div ngbAccordionItem>
        <bkd-student-dossier-entry-header
          [icon]="icon()"
          [category]="category()"
        >
          Content
        </bkd-student-dossier-entry-header>
        <div ngbAccordionCollapse>
          <div ngbAccordionBody><ng-template></ng-template></div>
        </div>
      </div>
    </div>
  `,
  imports: [
    StudentDossierEntryHeaderComponent,
    NgbAccordionDirective,
    NgbAccordionItem,
    NgbAccordionCollapse,
    NgbAccordionBody,
  ],
})
class HostComponent {
  icon = signal("notes");
  category = signal<Option<string>>(null);
}

describe("StudentDossierEntryHeaderComponent", () => {
  let fixture: ComponentFixture<HostComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [HostComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    element = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it("renders the icon", () => {
    expect(element.querySelector(".material-icons-outlined")?.textContent).toBe(
      "notes",
    );
  });

  it("does not render the category badge if not available", () => {
    expect(element.querySelector(".badge")).toBeNull();
  });

  it("renders the category badge if available", () => {
    fixture.componentInstance.category.set("Korrespondenz");
    fixture.detectChanges();
    expect(element.querySelector(".badge")?.textContent?.trim()).toBe(
      "Korrespondenz",
    );
  });
});
