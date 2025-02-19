import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "../../../../spec-helpers";
import { ImportParseSubscriptionDetailsService } from "../../services/import-parse-subscription-details.service";
import { ImportFileComponent } from "./import-file.component";

describe("ImportFileComponent", () => {
  let component: ImportFileComponent;
  let fixture: ComponentFixture<ImportFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [ImportFileComponent],
        providers: [ImportParseSubscriptionDetailsService],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(ImportFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
