import { ComponentFixture, TestBed } from "@angular/core/testing";
import { StorageService } from "../../services/storage.service";
import { ReportsLinkComponent } from "./reports-link.component";

describe("ReportsLinkComponent", () => {
  let fixture: ComponentFixture<ReportsLinkComponent>;
  let element: HTMLElement;
  let storageServiceMock: jasmine.SpyObj<StorageService>;

  beforeEach(() => {
    storageServiceMock = jasmine.createSpyObj("StorageService", [
      "getAccessToken",
    ]);
    storageServiceMock.getAccessToken.and.returnValue("test-token");

    spyOn(window, "open");

    TestBed.configureTestingModule({
      imports: [ReportsLinkComponent],
      providers: [{ provide: StorageService, useValue: storageServiceMock }],
    });
    fixture = TestBed.createComponent(ReportsLinkComponent);
    element = fixture.debugElement.nativeElement;

    fixture.componentRef.setInput("reports", []);
  });

  it("does not render link if no reports are available", () => {
    fixture.detectChanges();

    const links = Array.from(element.querySelectorAll("a"));
    expect(links).toHaveSize(0);
  });

  it("renders link without dropdown if single report is available", () => {
    fixture.componentRef.setInput("reports", [
      {
        id: 123,
        type: "crystal",
        title: "Report 1",
        url: "http://example.com/report1.pdf",
      },
    ]);
    fixture.detectChanges();

    const links = Array.from(element.querySelectorAll("a"));
    expect(links).toHaveSize(1);
    expect(links[0].href).toBe("http://example.com/report1.pdf");

    expect(element.querySelector("[ngbDropdownToggle]")).toBeNull();
    expect(element.querySelector("[ngbDropdownMenu]")).toBeNull();

    links[0].click();

    expect(storageServiceMock.getAccessToken).toHaveBeenCalled();
    expect(window.open).toHaveBeenCalledWith(
      new URL("http://example.com/report1.pdf?token=test-token"),
      "_blank",
    );
  });

  it("renders link with dropdown if multiple reports are available", () => {
    fixture.componentRef.setInput("reports", [
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
    ]);
    fixture.detectChanges();

    const links = Array.from(element.querySelectorAll("a"));
    expect(links).toHaveSize(1);
    expect(element.querySelector("[ngbDropdownToggle]")).toBeTruthy();

    const menu = element.querySelector("[ngbDropdownMenu]");
    expect(menu).toBeTruthy();
    expect(menu?.textContent).toContain("Report 1");
    expect(menu?.textContent).toContain("Report 2");

    const dropdownButton: HTMLButtonElement =
      element.querySelector("button[ngbDropdownItem]") ||
      ({} as HTMLButtonElement);
    expect(dropdownButton).toBeTruthy();
    dropdownButton.click();

    expect(storageServiceMock.getAccessToken).toHaveBeenCalled();
    expect(window.open).toHaveBeenCalledWith(
      new URL("http://example.com/report1.pdf?token=test-token"),
      "_blank",
    );
  });
});
