import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { AvatarEditComponent } from "./avatar-edit.component";

describe("AvatarEditComponent", () => {
  let component: AvatarEditComponent;
  let fixture: ComponentFixture<AvatarEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [AvatarEditComponent],
        providers: [NgbActiveModal],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(AvatarEditComponent);
    fixture.componentRef.setInput("studentId", 42);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
