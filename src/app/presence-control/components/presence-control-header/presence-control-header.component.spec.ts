import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { BehaviorSubject } from "rxjs";
import { buildReference } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { fromLesson } from "../../models/lesson-entry.model";
import { PresenceControlGroupService } from "../../services/presence-control-group.service";
import { PresenceControlStateService } from "../../services/presence-control-state.service";
import { PresenceControlHeaderComponent } from "./presence-control-header.component";

describe("PresenceControlHeaderComponent", () => {
  let component: PresenceControlHeaderComponent;
  let fixture: ComponentFixture<PresenceControlHeaderComponent>;
  let element: HTMLElement;
  let groupsAvailability$: BehaviorSubject<boolean>;
  let group$: BehaviorSubject<string | number | null>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [PresenceControlHeaderComponent],
        providers: [
          {
            provide: PresenceControlStateService,
            useFactory() {
              groupsAvailability$ = new BehaviorSubject(false);
              return {
                groupsAvailability$,
              };
            },
          },
          {
            provide: PresenceControlGroupService,
            useFactory() {
              group$ = new BehaviorSubject<string | number | null>(null);
              return { group$ };
            },
          },
        ],
      }),
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresenceControlHeaderComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;

    const lesson = {
      LessonRef: buildReference(),
      EventDesignation: "Deutsch",
      EventRef: buildReference(),
      StudyClassNumber: "DHF2018a",
      TeacherInformation: "Monika Muster",
      LessonDateTimeFrom: new Date(),
      LessonDateTimeTo: new Date(),
    };

    const lessonEntry = fromLesson(lesson);

    component.lessons = [lessonEntry];
    component.selectedLesson = lessonEntry;
  });

  describe("group button", () => {
    describe("not available", () => {
      beforeEach(() => {
        groupsAvailability$.next(false);
      });

      it("does not render group button", () => {
        const button = getGroupButton();
        expect(button).toBeNull();
      });
    });

    describe("available", () => {
      beforeEach(() => {
        groupsAvailability$.next(true);
      });

      it("renders inactive group button if no group is selected", () => {
        group$.next(null);
        fixture.detectChanges();
        const button = getGroupButton();
        expect(button).not.toBeNull();
        expect(button?.classList?.contains("btn-link")).toBe(true);
        expect(button?.classList?.contains("btn-danger")).toBe(false);
      });

      it("renders active group button if group is selected", () => {
        group$.next(123);
        fixture.detectChanges();
        const button = getGroupButton();
        expect(button).not.toBeNull();
        expect(button?.classList?.contains("btn-link")).toBe(false);
        expect(button?.classList?.contains("btn-danger")).toBe(true);
      });
    });
  });

  function getGroupButton() {
    return element.querySelector(".btn.group");
  }
});
