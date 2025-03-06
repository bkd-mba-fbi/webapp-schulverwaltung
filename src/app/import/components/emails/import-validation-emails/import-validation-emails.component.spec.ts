import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
} from "@angular/core/testing";
import { Router } from "@angular/router";
import { ImportStateService } from "src/app/import/services/common/import-state.service";
import {
  EmailImportEntry,
  ImportValidateEmailsService,
} from "src/app/import/services/emails/import-validate-emails.service";
import {
  InvalidPersonEmailError,
  InvalidPersonIdError,
} from "src/app/import/utils/emails/error";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { ImportValidationEmailsComponent } from "./import-validation-emails.component";

describe("ImportValidationEmailsComponent", () => {
  let component: ImportValidationEmailsComponent;
  let fixture: ComponentFixture<ImportValidationEmailsComponent>;
  let element: HTMLElement;
  let validateServiceMock: jasmine.SpyObj<ImportValidateEmailsService>;
  let resolveEntries: (entries: ReadonlyArray<EmailImportEntry>) => void;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [ImportValidationEmailsComponent],
        providers: [
          {
            provide: ImportValidateEmailsService,
            useFactory() {
              validateServiceMock = jasmine.createSpyObj(
                "ImportValidateEmailsService",
                ["fetchAndValidate"],
              );

              validateServiceMock.fetchAndValidate.and.returnValue(
                new Promise((resolve) => (resolveEntries = resolve)),
              );

              return validateServiceMock;
            },
          },
        ],
      }),
    ).compileComponents();

    const router = TestBed.inject(Router);
    spyOn(router, "navigate");

    const state = TestBed.inject(ImportStateService);
    state.parsedEntries.set([
      {
        personId: 100,
        personEmail: "s1@test.ch",
      },
    ]);

    fixture = TestBed.createComponent(ImportValidationEmailsComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;

    fixture.detectChanges();
  });

  describe("isValid", () => {
    let entry: EmailImportEntry;
    beforeEach(() => {
      entry = buildEntry();
    });

    it("returns true if the entry has no error", () => {
      expect(component.isValid(entry)).toBe(true);
    });

    it("returns false if the entry has an error", () => {
      entry.validationStatus = "invalid";
      entry.validationError = new InvalidPersonIdError();
      expect(component.isValid(entry)).toBe(false);
    });
  });

  describe("value getters", () => {
    let entry: EmailImportEntry;
    beforeEach(() => {
      entry = buildEntry();
    });

    describe("getPersonValue", () => {
      it("returns the person fullname if the entry is valid", () => {
        entry.data.person = {
          Id: 10,
          FullName: "John Lennon",
          Email: "s1@test.ch",
          DisplayEmail: "",
        };
        expect(component.getPersonValue(entry)).toBe("John Lennon");
      });

      it("returns the person ID and email if the entry is invalid", () => {
        entry.validationStatus = "invalid";
        entry.validationError = new InvalidPersonEmailError();
        entry.data.person = {
          Id: 10,
          FullName: "John Lennon",
          Email: "s1@test.ch",
          DisplayEmail: "",
        };
        expect(component.getPersonValue(entry)).toBe(100);
      });
    });

    describe("getEmailValue", () => {
      it("returns the person email if the entry is valid", () => {
        entry.data.person = {
          Id: 10,
          FullName: "John Lennon",
          Email: "s1@test.ch",
          DisplayEmail: "",
        };
        expect(component.getEmailValue(entry)).toBe("s1@test.ch");
      });

      it("returns the person ID and email if the entry is invalid", () => {
        entry.validationStatus = "invalid";
        entry.validationError = new InvalidPersonIdError();
        entry.data.person = {
          Id: 10,
          FullName: "John Lennon",
          Email: "s1@test.ch",
          DisplayEmail: "",
        };
        expect(component.getEmailValue(entry)).toBe("s1@test.ch");
      });
    });
  });

  describe("rendering", () => {
    it("displays spinner while validating", fakeAsync(() => {
      flush();
      fixture.detectChanges();

      expect(element.querySelector("bkd-spinner")).not.toBeNull();
      expect(element.querySelector("table")).toBeNull();
    }));

    it("displays table when results are available", fakeAsync(() => {
      const entry = buildEntry();
      entry.validationStatus = "valid";
      resolveEntries([entry]);
      flush();
      fixture.detectChanges();

      expect(element.querySelector("table")).not.toBeNull();
      expect(element.querySelector("bkd-spinner")).toBeNull();
    }));
  });

  function buildEntry(): EmailImportEntry {
    return {
      validationStatus: "valid",
      importStatus: null,
      entry: {
        personId: 100,
        personEmail: "s1@test.ch",
      },
      data: {},
      validationError: null,
      importError: null,
    };
  }
});
