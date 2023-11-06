import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { BehaviorSubject, of } from "rxjs";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { buildEvent } from "../../../../spec-builders";
import { StorageService } from "../../../shared/services/storage.service";
import { EventsStateService } from "../../services/events-state.service";
import { EventsListComponent } from "./events-list.component";

describe("EventsListComponent", () => {
  let component: EventsListComponent;
  let fixture: ComponentFixture<EventsListComponent>;
  let stateServiceMock: EventsStateService;
  let element: HTMLElement;
  let roles$: BehaviorSubject<Option<ReadonlyArray<string>>>;

  beforeEach(waitForAsync(() => {
    roles$ = new BehaviorSubject<Option<ReadonlyArray<string>>>(null);
    stateServiceMock = {
      loading$: of(false),
      events$: of([buildEvent(1)]),
      search$: of(""),
      roles$,
      getEvents: () => of([buildEvent(1)]),
    } as unknown as EventsStateService;

    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [EventsListComponent],
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

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should not show the ratings column", () => {
    component.withRatings = false;

    fixture.detectChanges();
    expect(element.textContent).not.toContain("events.rating");
  });

  it("should show the ratings column", () => {
    component.withRatings = true;

    fixture.detectChanges();
    expect(element.textContent).toContain("events.rating");
  });
});
