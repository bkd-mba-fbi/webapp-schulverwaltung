import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterModule } from "@angular/router";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { MyGradesComponent } from "./my-grades.component";

describe("MyGradesComponent", () => {
  let component: MyGradesComponent;
  let fixture: ComponentFixture<MyGradesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [MyGradesComponent],
        imports: [RouterModule],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyGradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
