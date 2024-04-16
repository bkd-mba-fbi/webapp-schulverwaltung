import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StorageService } from "../../../shared/services/storage.service";
import { MyGradesService } from "../../services/my-grades.service";
import { MyGradesShowComponent } from "./my-grades-show.component";

describe("MyGradesShowComponent", () => {
  let component: MyGradesShowComponent;
  let fixture: ComponentFixture<MyGradesShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [MyGradesShowComponent],
        providers: [
          {
            provide: MyGradesService,
            useValue: {
              studentId$: of(1),
              studentCourses$: of([]),
            },
          },
          {
            provide: StorageService,
            useValue: jasmine.createSpyObj("StorageService", ["getPayload"]),
          },
        ],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyGradesShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
