import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "../../../../spec-helpers";
import { ImportFileSubscriptionDetailsService } from "../../services/import-file-subscription-details.service";
import { ImportFileComponent } from "./import-file.component";

describe("ImportFileComponent", () => {
  let component: ImportFileComponent;
  let fixture: ComponentFixture<ImportFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [ImportFileComponent],
        providers: [ImportFileSubscriptionDetailsService],
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
