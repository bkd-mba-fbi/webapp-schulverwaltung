import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import {
  EventsStudentsStateService,
  StudentEntry,
} from "../../services/events-students-state.service";
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
                  firstName: "Paul",
                  lastName: "McCartney",
                  email: "paul.mccartney@example.com",
                  studyClass: "26a",
                  company: "Apple Records – Abbey Road Studios",
                },
                {
                  id: 20,
                  firstName: "John",
                  lastName: "Lennon",
                  email: "john.lennon@example.com",
                  studyClass: "26a",
                  company: undefined,
                },
                {
                  id: 30,
                  firstName: "George",
                  lastName: "Harrison",
                  email: "george.harrison@example.com",
                  studyClass: "26c",
                  company: undefined,
                },
                {
                  id: 40,
                  firstName: "Ringo",
                  lastName: "Starr",
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
      expect(element.textContent).toContain("Paul McCartney");
      expect(element.textContent).toContain("John Lennon");
      expect(element.textContent).toContain("George Harrison");
      expect(element.textContent).toContain("Ringo Starr");
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
      expect(element.textContent).toContain("Paul McCartney");
      expect(element.textContent).toContain("John Lennon");
      expect(element.textContent).toContain("George Harrison");
      expect(element.textContent).toContain("Ringo Starr");
    });

    it("renders placeholder if no entries are available", () => {
      stateServiceMock.entries.and.returnValue([]);
      stateServiceMock.filteredEntries.and.returnValue([]);
      fixture.detectChanges();
      expect(element.textContent).toContain("events-students.no-entries");
    });
  });
});
