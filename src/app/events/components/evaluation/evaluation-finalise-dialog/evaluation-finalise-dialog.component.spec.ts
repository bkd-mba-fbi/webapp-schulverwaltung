import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { of } from "rxjs";
import { EventSummary } from "src/app/shared/models/event.model";
import { EventsRestService } from "src/app/shared/services/events-rest.service";
import { LoadingService } from "src/app/shared/services/loading-service";
import { StatusProcessesRestService } from "src/app/shared/services/status-processes-rest.service";
import { EvaluationFinaliseDialogComponent } from "./evaluation-finalise-dialog.component";

describe("EvaluationFinaliseDialogComponent", () => {
  let component: EvaluationFinaliseDialogComponent;
  let fixture: ComponentFixture<EvaluationFinaliseDialogComponent>;
  let eventsService: jasmine.SpyObj<EventsRestService>;
  let statusProcessesService: jasmine.SpyObj<StatusProcessesRestService>;
  let loadingService: jasmine.SpyObj<LoadingService>;
  let activeModal: NgbActiveModal;

  const moduleEvent: EventSummary = {
    Id: 123,
    EventTypeId: 3,
    StatusId: 10,
  } as EventSummary;

  const nonModuleEvent: EventSummary = {
    Id: 456,
    EventTypeId: 1,
    StatusId: 20,
  } as EventSummary;

  beforeEach(async () => {
    eventsService = jasmine.createSpyObj("EventsRestService", [
      "getEventSummary",
    ]);
    statusProcessesService = jasmine.createSpyObj(
      "StatusProcessesRestService",
      ["forwardStatus"],
    );
    loadingService = jasmine.createSpyObj("LoadingService", [
      "load",
      "loading",
    ]);

    loadingService.loading.and.returnValue(of(false));
    loadingService.load.and.callFake((observable) => observable);

    await TestBed.configureTestingModule({
      imports: [EvaluationFinaliseDialogComponent, TranslateModule.forRoot()],
      providers: [
        NgbActiveModal,
        { provide: EventsRestService, useValue: eventsService },
        {
          provide: StatusProcessesRestService,
          useValue: statusProcessesService,
        },
        { provide: LoadingService, useValue: loadingService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EvaluationFinaliseDialogComponent);
    component = fixture.componentInstance;
    activeModal = TestBed.inject(NgbActiveModal);

    spyOn(activeModal, "close");
    spyOn(activeModal, "dismiss");
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load event summary when eventId is provided", fakeAsync(() => {
    component.eventId.set(123);
    eventsService.getEventSummary.and.returnValue(of(moduleEvent));

    fixture.detectChanges();
    tick();

    expect(eventsService.getEventSummary).toHaveBeenCalledWith(123);
    expect(component.eventSummary()).toEqual(moduleEvent);
    expect(component.isModuleEvent()).toBeTrue();
  }));

  it("should update status for module events and close modal with true", async () => {
    spyOn(component, "eventSummary").and.returnValue(moduleEvent);
    spyOn(component, "isModuleEvent").and.returnValue(true);

    statusProcessesService.forwardStatus.and.resolveTo(true);

    await component.confirm();

    expect(statusProcessesService.forwardStatus).toHaveBeenCalledWith(
      moduleEvent.StatusId,
      moduleEvent.Id,
    );
    expect(activeModal.close).toHaveBeenCalledWith(true);
  });

  it("should close modal with true for non-module events without status update", async () => {
    spyOn(component, "eventSummary").and.returnValue(nonModuleEvent);
    spyOn(component, "isModuleEvent").and.returnValue(false);

    await component.confirm();

    expect(statusProcessesService.forwardStatus).not.toHaveBeenCalled();
    expect(activeModal.close).toHaveBeenCalledWith(true);
  });

  it("should set isModuleEvent to false for non-module events", fakeAsync(() => {
    component.eventId.set(456);
    eventsService.getEventSummary.and.returnValue(of(nonModuleEvent));

    fixture.detectChanges();
    tick();

    expect(component.isModuleEvent()).toBeFalse();
  }));
});
