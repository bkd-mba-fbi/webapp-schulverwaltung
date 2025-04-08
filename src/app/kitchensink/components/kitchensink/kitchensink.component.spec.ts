import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { KitchensinkComponent } from "./kitchensink.component";

describe("KitchensinkComponent", () => {
  let component: KitchensinkComponent;
  let fixture: ComponentFixture<KitchensinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [KitchensinkComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(KitchensinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
