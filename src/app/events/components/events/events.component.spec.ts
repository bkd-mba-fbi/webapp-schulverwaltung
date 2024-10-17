import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { EventsComponent } from "./events.component";

describe("EventsComponent", () => {
  let component: EventsComponent;
  let fixture: ComponentFixture<EventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [EventsComponent],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
