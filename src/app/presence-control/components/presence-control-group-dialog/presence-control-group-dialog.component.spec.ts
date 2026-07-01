import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { buildSubscriptionDetail } from "../../../../spec-builders";
import { buildTestModuleMetadata } from "../../../../spec-helpers";
import {
  DialogMode,
  PresenceControlGroupDialogComponent,
} from "./presence-control-group-dialog.component";

describe("PresenceControlGroupDialogComponent", () => {
  let component: PresenceControlGroupDialogComponent;
  let fixture: ComponentFixture<PresenceControlGroupDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [PresenceControlGroupDialogComponent],
        providers: [NgbActiveModal],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PresenceControlGroupDialogComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("dialogMode", DialogMode.Select);
    fixture.componentRef.setInput(
      "subscriptionDetailsDefinitions",
      buildSubscriptionDetail(3843),
    );
    fixture.componentRef.setInput("group", null);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
    expect(component.title()).toBe("presence-control.groups.select.title");
    expect(component.selected()).toEqual({
      id: null,
      label: "presence-control.groups.all",
    });
  });
});
