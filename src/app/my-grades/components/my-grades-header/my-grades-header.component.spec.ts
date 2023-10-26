import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MyGradesHeaderComponent } from "./my-grades-header.component";
import { buildTestModuleMetadata } from "../../../../spec-helpers";
import { MyGradesService } from "../../services/my-grades.service";
import { of } from "rxjs";

describe("MyGradesHeaderComponent", () => {
  let component: MyGradesHeaderComponent;
  let fixture: ComponentFixture<MyGradesHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [MyGradesHeaderComponent],
        providers: [
          {
            provide: MyGradesService,
            useValue: {
              studentId$: of(1),
              studentCourses$: of([]),
            },
          },
        ],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyGradesHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
