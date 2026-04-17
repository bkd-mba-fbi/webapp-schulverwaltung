import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { MyDossierComponent } from "./my-dossier.component";

describe("MyDossierComponent", () => {
  let component: MyDossierComponent;
  let fixture: ComponentFixture<MyDossierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [MyDossierComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(MyDossierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
