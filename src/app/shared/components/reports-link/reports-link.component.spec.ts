import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ReportsLinkComponent } from "./reports-link.component";

describe("ReportsLinkComponent", () => {
  let component: ReportsLinkComponent;
  let fixture: ComponentFixture<ReportsLinkComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportsLinkComponent],
    });
    fixture = TestBed.createComponent(ReportsLinkComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
  });

  it("does not render link if no reports are available", () => {
    component.reports = [];
    fixture.detectChanges();

    const links = Array.from(element.querySelectorAll("a"));
    expect(links).toHaveSize(0);
  });

  it("renders link without dropdown if single report is available", () => {
    component.reports = [
      {
        id: 123,
        type: "crystal",
        title: "Report 1",
        url: "http://example.com/report1.pdf",
      },
    ];
    fixture.detectChanges();

    const links = Array.from(element.querySelectorAll("a"));
    expect(links).toHaveSize(1);
    expect(links[0].href).toBe("http://example.com/report1.pdf");

    expect(element.querySelector("[ngbDropdownToggle]")).toBeNull();
    expect(element.querySelector("[ngbDropdownMenu]")).toBeNull();
  });

  it("renders link with dropdown if multiple reports are available", () => {
    component.reports = [
      {
        id: 123,
        type: "crystal",
        title: "Report 1",
        url: "http://example.com/report1.pdf",
      },
      {
        id: 456,
        type: "excel",
        title: "Report 2",
        url: "http://example.com/report2.xls",
      },
    ];
    fixture.detectChanges();

    const links = Array.from(element.querySelectorAll("a"));
    expect(links).toHaveSize(1);
    expect(element.querySelector("[ngbDropdownToggle]")).toBeTruthy();

    const menu = element.querySelector("[ngbDropdownMenu]");
    expect(menu).toBeTruthy();
    expect(menu?.textContent).toContain("Report 1");
    expect(menu?.textContent).toContain("Report 2");
  });
});
