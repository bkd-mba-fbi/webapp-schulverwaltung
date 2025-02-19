import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { buildTestModuleMetadata } from "../../../../spec-helpers";
import { ProgressComponent } from "./progress.component";

describe("ProgressComponent", () => {
  let fixture: ComponentFixture<ProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [ProgressComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(ProgressComponent);

    fixture.componentRef.setInput("processed", 25);
    fixture.componentRef.setInput("total", 100);
    fixture.componentRef.setInput(
      "ariaLabel",
      "Import subscription details progress",
    );

    fixture.detectChanges();
  });

  it("renders the progress bar", () => {
    const progress = fixture.debugElement.queryAll(By.css("bkd-progress"));
    expect(progress).not.toBeNull();
  });

  it("renders the label", () => {
    const label = fixture.debugElement.nativeElement.textContent?.trim();
    expect(label).toBe("25 / 100");
  });

  it("renders the aria label", () => {
    const ariaLabel = fixture.debugElement.query(By.css("div")).attributes[
      "aria-label"
    ];
    expect(ariaLabel).toBe("Import subscription details progress");
  });
});
