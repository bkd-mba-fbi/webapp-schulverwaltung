import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { BehaviorSubject, of } from "rxjs";
import { buildTestModuleMetadata, changeInput } from "src/spec-helpers";
import { buildEventEntry } from "../../../../spec-builders";
import { StorageService } from "../../../shared/services/storage.service";
import { EventsStateService } from "../../services/events-state.service";
import { EventsListComponent } from "./events-list.component";

describe("EventsListComponent", () => {
  let component: EventsListComponent;
  let fixture: ComponentFixture<EventsListComponent>;
  let stateServiceMock: EventsStateService;
  let element: HTMLElement;
  let roles$: BehaviorSubject<Option<ReadonlyArray<string>>>;
  let setWithStudyCourses: jasmine.Spy;

  beforeEach(waitForAsync(() => {
    roles$ = new BehaviorSubject<Option<ReadonlyArray<string>>>(null);
    setWithStudyCourses = jasmine.createSpy("setWithStudyCourses");
    stateServiceMock = {
      loading$: of(false),
      events$: of([buildEventEntry(1)]),
      search$: of(""),
      roles$,
      setRoles(roles: Option<ReadonlyArray<string>>) {
        roles$.next(roles);
      },
      setWithStudyCourses,
      getEntries: () => of([buildEventEntry(1)]),
    } as unknown as EventsStateService;

    TestBed.configureTestingModule(
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
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsListComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  describe("withRatings", () => {
    it("renders entry without ratings column", () => {
      component.withRatings = false;

      fixture.detectChanges();
      expect(element.textContent).not.toContain("events.rating");
    });

    it("renders entry with ratings column", () => {
      component.withRatings = true;

      fixture.detectChanges();
      expect(element.textContent).toContain("events.rating");
    });
  });

  describe("withStudyCourses", () => {
    it("enables study courses on state service if set to true", () => {
      changeInput(component, "withStudyCourses", true);
      fixture.detectChanges();
      expect(setWithStudyCourses).toHaveBeenCalledWith(true);
    });

    it("does not enable study courses on state service if set to false", () => {
      changeInput(component, "withStudyCourses", false);
      fixture.detectChanges();
      expect(setWithStudyCourses).toHaveBeenCalledWith(false);
    });
  });
});
