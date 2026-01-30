import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BehaviorSubject, of } from "rxjs";
import { buildTestModuleMetadata, changeInput } from "src/spec-helpers";
import { buildEventEntry } from "../../../../../spec-builders";
import { StorageService } from "../../../../shared/services/storage.service";
import { EventsStateService } from "../../../services/events-state.service";
import { EventsListComponent } from "./events-list.component";

describe("EventsListComponent", () => {
  let component: EventsListComponent;
  let fixture: ComponentFixture<EventsListComponent>;
  let stateServiceMock: EventsStateService;
  let element: HTMLElement;
  let roles$: BehaviorSubject<Option<ReadonlyArray<string>>>;
  let setWithStudyCourses: jasmine.Spy;
  let setSearchFields: jasmine.Spy;

  beforeEach(async () => {
    roles$ = new BehaviorSubject<Option<ReadonlyArray<string>>>(null);
    setWithStudyCourses = jasmine.createSpy("setWithStudyCourses");
    setSearchFields = jasmine.createSpy("setSearchFields");
    stateServiceMock = {
      loading$: of(false),
      events$: of([buildEventEntry(1)]),
      search$: of(""),
      roles$,
      setRoles(roles: Option<ReadonlyArray<string>>) {
        roles$.next(roles);
      },
      setWithStudyCourses,
      setSearchFields,
      getEntries: () => of([buildEventEntry(1)]),
    } as unknown as EventsStateService;

    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [EventsListComponent],
        providers: [
          { provide: EventsStateService, useValue: stateServiceMock },
          {
            provide: StorageService,
            useValue: {
              getPayload(): Option<object> {
                return { roles: "TeacherRole" };
              },
            },
          },
        ],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsListComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
  });

  describe("withRatings", () => {
    it("renders entry with ratings column it set to true", () => {
      changeInput(component, "withRatings", true);
      fixture.detectChanges();
      expect(element.textContent).toContain("events.rating");
    });

    it("renders entry without ratings column it set to false", () => {
      changeInput(component, "withRatings", false);
      fixture.detectChanges();
      expect(element.textContent).not.toContain("events.rating");
    });

    it("includes 'evaluationText' in search fields it set to true", () => {
      changeInput(component, "withRatings", true);
      fixture.detectChanges();
      expect(setSearchFields).toHaveBeenCalledWith([
        "designation",
        "evaluationText",
      ]);
    });

    it("does not include in search fields it set to false", () => {
      changeInput(component, "withRatings", false);
      fixture.detectChanges();
      expect(setSearchFields).toHaveBeenCalledWith(["designation"]);
    });
  });
});
