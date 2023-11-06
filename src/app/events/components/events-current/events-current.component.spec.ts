import { ComponentFixture, TestBed } from "@angular/core/testing";
import { StorageService } from "src/app/shared/services/storage.service";
import { buildTestModuleMetadata } from "../../../../spec-helpers";
import { EventsListComponent } from "../events-list/events-list.component";
import { EventsCurrentComponent } from "./events-current.component";

describe("EventsCurrentComponent", () => {
  let component: EventsCurrentComponent;
  let fixture: ComponentFixture<EventsCurrentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [EventsCurrentComponent, EventsListComponent],
        providers: [
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

    fixture = TestBed.createComponent(EventsCurrentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
