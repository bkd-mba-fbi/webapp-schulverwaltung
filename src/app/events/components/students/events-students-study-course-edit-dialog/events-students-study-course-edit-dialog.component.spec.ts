import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { of } from "rxjs";
import { StatusProcessesRestService } from "src/app/shared/services/status-processes-rest.service";
import { EventsStudentsStudyCourseEditDialogComponent } from "./events-students-study-course-edit-dialog.component";

describe("EventsStudentsStudyCourseDetailStatusDialogComponent", () => {
  let component: EventsStudentsStudyCourseEditDialogComponent;
  let fixture: ComponentFixture<EventsStudentsStudyCourseEditDialogComponent>;
  let updateServiceMock: jasmine.SpyObj<StatusProcessesRestService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EventsStudentsStudyCourseEditDialogComponent,
        TranslateModule.forRoot(),
      ],
      providers: [
        NgbActiveModal,
        {
          provide: StatusProcessesRestService,
          useFactory() {
            updateServiceMock = jasmine.createSpyObj(
              "StatusProcessesRestService",
              ["getStatusList", "updateStatus"],
            );
            updateServiceMock.getStatusList.and.returnValue(
              of([{ IdStatus: 2, Status: "Sistiert" }]),
            );
            return updateServiceMock;
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(
      EventsStudentsStudyCourseEditDialogComponent,
    );
    component = fixture.componentInstance;

    fixture.componentRef.setInput("currentStatus", {
      IdStatus: 1,
      Status: "Aufgenommen",
    });
    fixture.componentRef.setInput("subscriptionId", 3);
    fixture.componentRef.setInput("personId", 5);

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("generates options from grading scale", () => {
    fixture.detectChanges();
    const options: { IdStatus: number; Status: string }[] | undefined =
      component.statusList();
    expect(options).not.toBeNull();
    expect(options).not.toBeUndefined();
    expect(options?.length).toBe(2);
    expect(options![0]).toEqual({
      IdStatus: 1,
      Status: "Aufgenommen",
    });
  });
});
