import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { PresenceControlBlockLessonComponent } from "./presence-control-block-lesson.component";

describe("PresenceControlBlockLessonComponent", () => {
  let component: PresenceControlBlockLessonComponent;
  let fixture: ComponentFixture<PresenceControlBlockLessonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [PresenceControlBlockLessonComponent],
        providers: [NgbActiveModal],
      }),
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresenceControlBlockLessonComponent);
    component = fixture.componentInstance;
    component.blockPresenceControlEntries = [];
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
