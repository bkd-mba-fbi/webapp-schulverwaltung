import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { PresenceControlIncidentComponent } from "./presence-control-incident.component";

describe("PresenceControlIncidentComponent", () => {
  let component: PresenceControlIncidentComponent;
  let fixture: ComponentFixture<PresenceControlIncidentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [PresenceControlIncidentComponent],
        providers: [NgbActiveModal],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PresenceControlIncidentComponent);
    component = fixture.componentInstance;
    component.incidentTypes = [];
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
