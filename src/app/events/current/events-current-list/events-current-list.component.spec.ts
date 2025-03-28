import { ComponentFixture, TestBed } from "@angular/core/testing";
import { StorageService } from "src/app/shared/services/storage.service";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { EventsCurrentListComponent } from "./events-current-list.component";

describe("EventsCurrentListComponent", () => {
  let component: EventsCurrentListComponent;
  let fixture: ComponentFixture<EventsCurrentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [EventsCurrentListComponent],
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

    fixture = TestBed.createComponent(EventsCurrentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
