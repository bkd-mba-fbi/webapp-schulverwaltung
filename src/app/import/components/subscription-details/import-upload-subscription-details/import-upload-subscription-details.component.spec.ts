import { HttpErrorResponse } from "@angular/common/http";
import { signal } from "@angular/core";
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
} from "@angular/core/testing";
import { Router } from "@angular/router";
import { ImportStateService } from "src/app/import/services/common/import-state.service";
import { ImportError } from "src/app/import/services/common/import-state.service";
import {
  ImportUploadSubscriptionDetailsService,
  UploadProgress,
} from "src/app/import/services/subscription-details/import-upload-subscription-details.service";
import { SubscriptionDetailImportEntry } from "src/app/import/services/subscription-details/import-validate-subscription-details.service";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { ImportUploadSubscriptionDetailsComponent } from "./import-upload-subscription-details.component";

/* eslint-disable @typescript-eslint/no-explicit-any */

describe("ImportUploadSubscriptionDetailsComponent", () => {
  let fixture: ComponentFixture<ImportUploadSubscriptionDetailsComponent>;
  let element: HTMLElement;
  let uploadServiceMock: jasmine.SpyObj<ImportUploadSubscriptionDetailsService>;
  let resolveEntries: (
    entries: ReadonlyArray<SubscriptionDetailImportEntry>,
  ) => void;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [ImportUploadSubscriptionDetailsComponent],
        providers: [
          {
            provide: ImportUploadSubscriptionDetailsService,
            useFactory() {
              uploadServiceMock = jasmine.createSpyObj(
                "ImportUploadSubscriptionDetailsService",
                ["upload"],
              );

              uploadServiceMock.upload.and.returnValue(
                new Promise((resolve) => (resolveEntries = resolve)),
              );

              (uploadServiceMock as any).progress = signal<UploadProgress>({
                uploading: 0,
                success: 0,
                error: 0,
                total: 0,
              });

              return uploadServiceMock;
            },
          },
        ],
      }),
    ).compileComponents();

    const router = TestBed.inject(Router);
    spyOn(router, "navigate");

    const state = TestBed.inject(ImportStateService);
    state.importEntries.set([buildEntry()]);

    fixture = TestBed.createComponent(ImportUploadSubscriptionDetailsComponent);
    element = fixture.debugElement.nativeElement;

    fixture.detectChanges();
  });

  describe("rendering", () => {
    it("displays progress bar while uploading", fakeAsync(() => {
      uploadServiceMock.progress.set({
        uploading: 1,
        success: 0,
        error: 0,
        total: 1,
      });

      flush();
      fixture.detectChanges();

      expect(element.querySelector("bkd-progress")).not.toBeNull();
      expect(element.querySelector("table")).toBeNull();
    }));

    it("displays success message", fakeAsync(() => {
      uploadServiceMock.progress.set({
        uploading: 0,
        success: 1,
        error: 0,
        total: 1,
      });

      const entry = buildEntry();
      entry.importStatus = "success";
      resolveEntries([entry]);
      flush();
      fixture.detectChanges();

      expect(element.textContent).toContain("import.upload.success.title");
      expect(element.textContent).not.toContain("import.upload.error.title");
      expect(element.querySelector("bkd-progress")).toBeNull();
    }));

    it("displays error message & table with failed results when results are available", fakeAsync(() => {
      uploadServiceMock.progress.set({
        uploading: 0,
        success: 0,
        error: 1,
        total: 1,
      });

      const entry = buildEntry();
      entry.importStatus = "error";
      entry.importError = new ImportError(
        new Error("500 Internal Server Error"),
      );
      resolveEntries([entry]);
      flush();
      fixture.detectChanges();

      expect(element.textContent).toContain("import.upload.error.title");
      expect(element.querySelector("table")).not.toBeNull();
      expect(element.textContent).not.toContain("import.upload.success.title");
      expect(element.textContent).toContain("import.upload.error.entry-error");
      expect(element.querySelector("bkd-progress")).toBeNull();
    }));

    it("displays error message from HttpErrorResponse", fakeAsync(() => {
      uploadServiceMock.progress.set({
        uploading: 0,
        success: 0,
        error: 1,
        total: 1,
      });

      const entry = buildEntry();
      entry.importStatus = "error";
      entry.importError = new ImportError(
        new HttpErrorResponse({
          error: {
            Issues: [{ Message: "Some custom error message" }],
          },
        }),
      );
      resolveEntries([entry]);
      flush();
      fixture.detectChanges();

      expect(element.textContent).toContain("import.upload.error.title");
      expect(element.querySelector("table")).not.toBeNull();
      expect(element.textContent).not.toContain("import.upload.success.title");
      expect(element.textContent).toContain("Some custom error message");
      expect(element.textContent).not.toContain(
        "import.upload.error.entry-error",
      );
      expect(element.querySelector("bkd-progress")).toBeNull();
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
