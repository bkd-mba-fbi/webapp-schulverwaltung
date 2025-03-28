import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
} from "@angular/core/testing";
import { Router } from "@angular/router";
import { ImportStateService } from "src/app/import/services/common/import-state.service";
import {
  ImportValidateSubscriptionDetailsService,
  SubscriptionDetailImportEntry,
} from "src/app/import/services/subscription-details/import-validate-subscription-details.service";
import {
  InvalidEventIdError,
  InvalidValueTypeError,
  MissingPersonIdEmailError,
} from "src/app/import/utils/subscription-details/error";
import { buildSubscriptionDetail } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { ImportValidationSubscriptionDetailsComponent } from "./import-validation-subscription-details.component";

describe("ImportValidationSubscriptionDetailsComponent", () => {
  let component: ImportValidationSubscriptionDetailsComponent;
  let fixture: ComponentFixture<ImportValidationSubscriptionDetailsComponent>;
  let element: HTMLElement;
  let validateServiceMock: jasmine.SpyObj<ImportValidateSubscriptionDetailsService>;
  let resolveEntries: (
    entries: ReadonlyArray<SubscriptionDetailImportEntry>,
  ) => void;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [ImportValidationSubscriptionDetailsComponent],
        providers: [
          {
            provide: ImportValidateSubscriptionDetailsService,
            useFactory() {
              validateServiceMock = jasmine.createSpyObj(
                "ImportValidateSubscriptionDetailsService",
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
        eventId: 10,
        personId: 100,
        personEmail: "s1@test.ch",
        subscriptionDetailId: 1100000,
        value: "Lorem ipsum",
      },
    ]);

    fixture = TestBed.createComponent(
      ImportValidationSubscriptionDetailsComponent,
    );
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;

    fixture.detectChanges();
  });

  describe("isValid", () => {
    let entry: SubscriptionDetailImportEntry;
    beforeEach(() => {
      entry = buildEntry();
    });

    it("returns true if the entry has no error", () => {
      expect(component.isValid(entry)).toBe(true);
    });

    it("returns false if the entry has an error", () => {
      entry.validationStatus = "invalid";
      entry.validationError = new MissingPersonIdEmailError();
      expect(component.isValid(entry)).toBe(false);
    });

    it("returns true if the entry has no error, for any columns", () => {
      expect(component.isValid(entry, ["personId", "personEmail"])).toBe(true);
    });

    it("returns false if the entry's error is relevant for one of the given columns", () => {
      entry.validationStatus = "invalid";
      entry.validationError = new MissingPersonIdEmailError();
      expect(component.isValid(entry, ["personId", "personEmail"])).toBe(false);
    });

    it("return true if the entry's error is not relevant to any of the given columns", () => {
      entry.validationStatus = "invalid";
      entry.validationError = new InvalidEventIdError();
      expect(component.isValid(entry, ["personId", "personEmail"])).toBe(true);
    });
  });

  describe("value getters", () => {
    let entry: SubscriptionDetailImportEntry;
    beforeEach(() => {
      entry = buildEntry();
    });

    describe("getEventValue", () => {
      it("returns the event designation if the entry is valid", () => {
        entry.data.event = { Id: 10, Designation: "Englisch S3" };
        expect(component.getEventValue(entry)).toBe("Englisch S3");
      });

      it("returns the event ID if the entry is invalid", () => {
        entry.validationStatus = "invalid";
        entry.validationError = new InvalidValueTypeError();
        entry.data.event = { Id: 10, Designation: "Englisch S3" };
        expect(component.getEventValue(entry)).toBe(10);
      });
    });

    describe("getPersonValue", () => {
      it("returns the person fullname if the entry is valid", () => {
        entry.data.person = { Id: 10, FullName: "John Lennon" };
        expect(component.getPersonValue(entry)).toBe("John Lennon");
      });

      it("returns the person ID and email if the entry is invalid", () => {
        entry.validationStatus = "invalid";
        entry.validationError = new InvalidValueTypeError();
        entry.data.person = { Id: 10, FullName: "John Lennon" };
        expect(component.getPersonValue(entry)).toBe(100);
      });
    });

    describe("getSubscriptionDetailValue", () => {
      it("returns the subscription detail designation if the entry is valid", () => {
        const detail = buildSubscriptionDetail(123);
        detail.VssDesignation = "Titel Maturarbeit";
        entry.data.subscriptionDetail = detail;
        expect(component.getSubscriptionDetailValue(entry)).toBe(
          "Titel Maturarbeit",
        );
      });

      it("returns the subscription detail ID if the entry is invalid", () => {
        entry.validationStatus = "invalid";
        entry.validationError = new InvalidValueTypeError();
        const detail = buildSubscriptionDetail(123);
        detail.VssDesignation = "Titel Maturarbeit";
        entry.data.subscriptionDetail = detail;
        expect(component.getSubscriptionDetailValue(entry)).toBe(1100000);
      });
    });

    describe("getValue", () => {
      it("returns the value", () => {
        expect(component.getValue(entry)).toBe("Lorem ipsum");
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

  function buildEntry(): SubscriptionDetailImportEntry {
    return {
      validationStatus: "valid",
      importStatus: null,
      entry: {
        eventId: 10,
        personId: 100,
        personEmail: "s1@test.ch",
        subscriptionDetailId: 1100000,
        value: "Lorem ipsum",
      },
      data: {},
      validationError: null,
      importError: null,
    };
  }
});
