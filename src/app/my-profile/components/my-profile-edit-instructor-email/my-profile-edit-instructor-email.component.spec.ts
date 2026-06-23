import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { PersonsRestService } from "src/app/shared/services/persons-rest.service";
import { ToastService } from "src/app/shared/services/toast.service";
import { buildPerson } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { MyProfileService } from "../../services/my-profile.service";
import { MyProfileEditInstructorEmailComponent } from "./my-profile-edit-instructor-email.component";

describe("MyProfileEditInstructorEmailComponent", () => {
  let fixture: ComponentFixture<MyProfileEditInstructorEmailComponent>;
  let element: HTMLElement;
  let profileService: MyProfileService;
  let personsService: jasmine.SpyObj<PersonsRestService>;
  let toastService: jasmine.SpyObj<ToastService>;
  let router: Router;

  beforeEach(async () => {
    const person = { ...buildPerson(42), Custom1: "instructor@example.com" };

    profileService = {
      person$: of(person),
      loadingPerson$: of(false),
      reloadStudent: jasmine.createSpy("reloadStudent"),
    } as unknown as MyProfileService;

    personsService = jasmine.createSpyObj("PersonsRestService", [
      "updateInstructorEmail",
    ]);
    personsService.updateInstructorEmail.and.returnValue(of(undefined));

    toastService = jasmine.createSpyObj("ToastService", ["success"]);

    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [MyProfileEditInstructorEmailComponent],
        providers: [
          { provide: MyProfileService, useValue: profileService },
          { provide: PersonsRestService, useValue: personsService },
          { provide: ToastService, useValue: toastService },
        ],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProfileEditInstructorEmailComponent);
    element = fixture.debugElement.nativeElement;

    router = TestBed.inject(Router);
    spyOn(router, "navigate");

    fixture.detectChanges();
  });

  it("renders form field with current value", () => {
    expect(getInput().value).toBe("instructor@example.com");
  });

  it("validates email address", () => {
    expect(element.querySelector(".invalid-feedback")).toBeNull();

    changeValue("instructor");
    expect(element.querySelector(".invalid-feedback")).toBeNull();

    clickSubmitButton();
    expect(element.querySelector(".invalid-feedback")).not.toBeNull();
    expect(personsService.updateInstructorEmail).not.toHaveBeenCalled();

    changeValue("");
    expect(element.querySelector(".invalid-feedback")).toBeNull();

    changeValue("jane@example.com");
    expect(element.querySelector(".invalid-feedback")).toBeNull();

    clickSubmitButton();
    expect(element.querySelector(".invalid-feedback")).toBeNull();
    expect(personsService.updateInstructorEmail).toHaveBeenCalled();
  });

  it("updates person on submit, reloads student and redirects back to profile", () => {
    changeValue("jane@example.com");
    clickSubmitButton();

    expect(element.querySelector(".invalid-feedback")).toBeNull();
    expect(personsService.updateInstructorEmail).toHaveBeenCalledWith(
      42,
      "jane@example.com",
    );
    expect(profileService.reloadStudent).toHaveBeenCalled();
    expect(toastService.success).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(["/my-profile"]);
  });

  it("navigates back to profile on cancel without saving", () => {
    clickCancelButton();

    expect(personsService.updateInstructorEmail).not.toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(["/my-profile"]);
  });

  function getInput(): HTMLInputElement {
    const field = element.querySelector("input[type='email']");
    expect(field).not.toBeNull();
    return field as HTMLInputElement;
  }

  function changeValue(value: string): void {
    const input = getInput();
    input.value = value;
    input.dispatchEvent(new Event("input"));
    fixture.detectChanges();
  }

  function clickSubmitButton(): void {
    const button = element.querySelector(
      ".btn-primary",
    ) as Option<HTMLButtonElement>;
    if (button) {
      button.click();
      fixture.detectChanges();
    }
  }

  function clickCancelButton(): void {
    const button = element.querySelector(
      ".btn-outline-secondary",
    ) as Option<HTMLButtonElement>;
    if (button) {
      button.click();
      fixture.detectChanges();
    }
  }
});
