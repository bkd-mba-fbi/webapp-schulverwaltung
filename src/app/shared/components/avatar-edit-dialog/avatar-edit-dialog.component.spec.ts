import { signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { of } from "rxjs";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { AdditionalInformationsRestService } from "../../services/additional-informations-rest.service";
import { CroptService } from "../../services/cropt.service";
import { AvatarEditDialogComponent } from "./avatar-edit-dialog.component";

describe("AvatarEditDialogComponent", () => {
  let component: AvatarEditDialogComponent;
  let fixture: ComponentFixture<AvatarEditDialogComponent>;
  let croptServiceMock: jasmine.SpyObj<CroptService>;
  let additionalInformationsServiceMock: jasmine.SpyObj<AdditionalInformationsRestService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [AvatarEditDialogComponent],
      }),
    )
      .overrideComponent(AvatarEditDialogComponent, {
        add: {
          providers: [
            NgbActiveModal,
            {
              provide: CroptService,
              useFactory() {
                croptServiceMock = jasmine.createSpyObj<CroptService>(
                  "CroptService",
                  ["configure", "setImage", "getCroppedImage"],
                  { error: signal<Option<unknown>>(null) },
                );

                croptServiceMock.getCroppedImage.and.returnValue(
                  Promise.resolve(
                    new File([], "avatar.jpg", { type: "image/jpeg" }),
                  ),
                );

                return croptServiceMock;
              },
            },
            {
              provide: AdditionalInformationsRestService,
              useFactory() {
                additionalInformationsServiceMock =
                  jasmine.createSpyObj<AdditionalInformationsRestService>(
                    "AdditionalInformationsRestService",
                    ["uploadPhoto"],
                  );

                additionalInformationsServiceMock.uploadPhoto.and.returnValue(
                  of(undefined),
                );

                return additionalInformationsServiceMock;
              },
            },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(AvatarEditDialogComponent);
    component = fixture.componentInstance;
    component.studentId.set(42);

    fixture.detectChanges();
  });

  it("proceeds through the steps", async () => {
    // Initial step
    expect(component.step()).toBe("choose");
    expect(component.canCancel()).toBe(true);
    expect(component.canProceed()).toBe(false);

    // Choose file
    component.file.set(new File([], "avatar.jpg", { type: "image/jpeg" }));
    fixture.detectChanges();
    expect(component.canProceed()).toBe(true);

    // Proceed to "crop" step
    expect(croptServiceMock.setImage).not.toHaveBeenCalled();
    await component.proceed();
    fixture.detectChanges();
    expect(croptServiceMock.setImage).toHaveBeenCalled();
    expect(component.step()).toBe("crop");
    expect(component.canCancel()).toBe(true);
    expect(component.canProceed()).toBe(true);

    // Proceed to "uploading" step
    expect(
      additionalInformationsServiceMock.uploadPhoto,
    ).not.toHaveBeenCalled();
    await component.proceed();
    fixture.detectChanges();
    expect(additionalInformationsServiceMock.uploadPhoto).toHaveBeenCalled();
    expect(component.step()).toBe("uploading");
    expect(component.canCancel()).toBe(true);
    expect(component.canProceed()).toBe(false);
  });
});
