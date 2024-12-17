import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "../../../../spec-helpers";
import { EventsCurrentComponent } from "./events-current.component";

describe("EventsCurrentComponent", () => {
  let component: EventsCurrentComponent;
  let fixture: ComponentFixture<EventsCurrentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [EventsCurrentComponent],
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
