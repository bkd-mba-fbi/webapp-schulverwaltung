import { ComponentFixture, TestBed } from "@angular/core/testing";
import { StorageService } from "src/app/shared/services/storage.service";
import { buildTestModuleMetadata } from "../../../../../spec-helpers";
import { EventsTestsComponent } from "./events-tests.component";

describe("EventsTestsComponent", () => {
  let component: EventsTestsComponent;
  let fixture: ComponentFixture<EventsTestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [EventsTestsComponent],
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

    fixture = TestBed.createComponent(EventsTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
