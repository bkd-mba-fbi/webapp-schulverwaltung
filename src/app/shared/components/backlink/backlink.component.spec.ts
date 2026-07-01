import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { BacklinkComponent } from "./backlink.component";

describe("BacklinkComponent", () => {
  let fixture: ComponentFixture<BacklinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [BacklinkComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(BacklinkComponent);
    fixture.componentRef.setInput("link", []);
    fixture.detectChanges();
  });

  it("should create", () => {
    const link = fixture.debugElement.nativeElement.querySelector("a");
    expect(link).toBeTruthy();
  });
});
