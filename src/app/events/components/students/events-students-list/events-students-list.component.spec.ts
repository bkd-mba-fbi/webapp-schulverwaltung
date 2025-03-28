import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import {
  EventsStudentsStateService,
  StudentEntry,
} from "../../../services/events-students-state.service";
import { EventsStudentsListComponent } from "./events-students-list.component";

describe("EventsStudentsListComponent", () => {
  let fixture: ComponentFixture<EventsStudentsListComponent>;
  let element: HTMLElement;
  let stateServiceMock: jasmine.SpyObj<EventsStudentsStateService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [EventsStudentsListComponent],
        providers: [
          {
            provide: EventsStudentsStateService,
            useFactory() {
              stateServiceMock = jasmine.createSpyObj(
                "EventsStudentsStateService",
                [
                  "isStudyCourse",
                  "loading",
                  "title",
                  "multipleStudyClasses",
                  "searchTerm",
                  "sortCriteria",
                  "entries",
                  "filteredEntries",
                  "mailtoLink",
                  "reports",
                ],
              );

              const entries: ReadonlyArray<StudentEntry> = [
                {
                  id: 10,
                  name: "McCartney Paul",
                  email: "paul.mccartney@example.com",
                  studyClass: "26a",
                  company: "Apple Records – Abbey Road Studios",
                },
                {
                  id: 20,
                  name: "Lennon John",
                  email: "john.lennon@example.com",
                  studyClass: "26a",
                  company: undefined,
                },
                {
                  id: 30,
                  name: "Harrison George",
                  email: "george.harrison@example.com",
                  studyClass: "26c",
                  company: undefined,
                },
                {
                  id: 40,
                  name: "Starr Ringo",
                  email: "ringo.starr@example.com",
                  studyClass: "26c",
                  company: undefined,
                },
              ];
              stateServiceMock.entries.and.returnValue(entries);
              stateServiceMock.filteredEntries.and.returnValue(entries);
              stateServiceMock.loading.and.returnValue(false);
              stateServiceMock.title.and.returnValue("English-S3");
              stateServiceMock.multipleStudyClasses.and.returnValue(false);
              stateServiceMock.searchTerm.and.returnValue("");
              stateServiceMock.sortCriteria.and.returnValue({
                primarySortKey: "name",
                ascending: true,
              });
              stateServiceMock.mailtoLink.and.returnValue(null);
              stateServiceMock.reports.and.returnValue([]);

              return stateServiceMock;
            },
          },
        ],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(EventsStudentsListComponent);
    element = fixture.debugElement.nativeElement;
  });

  describe("course/study class", () => {
    beforeEach(() => {
      stateServiceMock.isStudyCourse.and.returnValue(false);
    });

    it("renders students list", () => {
      fixture.detectChanges();
      expect(
        element.querySelector("bkd-events-students-course-list"),
      ).not.toBeNull();
      expect(element.querySelector("h1")?.textContent).toContain("English-S3");
      expect(element.textContent).toContain("McCartney Paul");
      expect(element.textContent).toContain("Lennon John");
      expect(element.textContent).toContain("Harrison George");
      expect(element.textContent).toContain("Starr Ringo");
    });

    it("renders placeholder if no entries are available", () => {
      stateServiceMock.entries.and.returnValue([]);
      stateServiceMock.filteredEntries.and.returnValue([]);
      fixture.detectChanges();
      expect(element.textContent).toContain("events-students.no-entries");
    });
  });

  describe("study course", () => {
    beforeEach(() => {
      stateServiceMock.isStudyCourse.and.returnValue(true);
    });

    it("renders students list", () => {
      fixture.detectChanges();
      expect(
        element.querySelector("bkd-events-students-study-course-list"),
      ).not.toBeNull();
      expect(element.querySelector("h1")?.textContent).toContain("English-S3");
      expect(element.textContent).toContain("McCartney Paul");
      expect(element.textContent).toContain("Lennon John");
      expect(element.textContent).toContain("Harrison George");
      expect(element.textContent).toContain("Starr Ringo");
    });

    it("renders placeholder if no entries are available", () => {
      stateServiceMock.entries.and.returnValue([]);
      stateServiceMock.filteredEntries.and.returnValue([]);
      fixture.detectChanges();
      expect(element.textContent).toContain("events-students.no-entries");
    });
  });
});
