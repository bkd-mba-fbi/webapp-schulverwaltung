import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { buildTestModuleMetadata } from "../../../../spec-helpers";
import { PresenceControlPrecedingAbsenceComponent } from "./presence-control-preceding-absence.component";

describe("PresenceControlPreviousAbsenceComponent", () => {
  let component: PresenceControlPrecedingAbsenceComponent;
  let fixture: ComponentFixture<PresenceControlPrecedingAbsenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [PresenceControlPrecedingAbsenceComponent],
        providers: [NgbActiveModal],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PresenceControlPrecedingAbsenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
