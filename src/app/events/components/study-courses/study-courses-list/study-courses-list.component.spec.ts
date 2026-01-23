import { ComponentFixture, TestBed } from "@angular/core/testing";
import { StudyCoursesStateService } from "src/app/events/services/study-courses-state.service";
import { StorageService } from "src/app/shared/services/storage.service";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StudyCoursesListComponent } from "./study-courses-list.component";

describe("StudyCoursesListComponent", () => {
  let component: StudyCoursesListComponent;
  let fixture: ComponentFixture<StudyCoursesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [StudyCoursesListComponent],
        providers: [
          StudyCoursesStateService,
          {
            provide: StorageService,
            useValue: {
              getPayload() {
                return {
                  culture_info: "",
                  fullname: "",
                  id_person: "123",
                  holder_id: "",
                  instance_id: "",
                  roles: "",
                };
              },
            },
          },
        ],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(StudyCoursesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
