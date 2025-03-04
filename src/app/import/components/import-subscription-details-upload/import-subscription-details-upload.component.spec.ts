import { signal } from "@angular/core";
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
} from "@angular/core/testing";
import { Router } from "@angular/router";
import { buildTestModuleMetadata } from "../../../../spec-helpers";
import { ImportStateService } from "../../services/import-state.service";
import {
  ImportUploadSubscriptionDetailsService,
  UploadProgress,
} from "../../services/import-upload-subscription-details.service";
import { SubscriptionDetailImportEntry } from "../../services/import-validate-subscription-details.service";
import { SubscriptionDetailImportError } from "../../utils/subscription-details/error";
import { ImportSubscriptionDetailsUploadComponent } from "./import-subscription-details-upload.component";

/* eslint-disable @typescript-eslint/no-explicit-any */

describe("ImportSubscriptionDetailsUploadComponent", () => {
  let fixture: ComponentFixture<ImportSubscriptionDetailsUploadComponent>;
  let element: HTMLElement;
  let uploadServiceMock: jasmine.SpyObj<ImportUploadSubscriptionDetailsService>;
  let resolveEntries: (
    entries: ReadonlyArray<SubscriptionDetailImportEntry>,
  ) => void;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [ImportSubscriptionDetailsUploadComponent],
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

    fixture = TestBed.createComponent(ImportSubscriptionDetailsUploadComponent);
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
      entry.importError = new SubscriptionDetailImportError(
        new Error("500 Internal Server Error"),
      );
      resolveEntries([entry]);
      flush();
      fixture.detectChanges();

      expect(element.textContent).toContain("import.upload.error.title");
      expect(element.querySelector("table")).not.toBeNull();
      expect(element.textContent).not.toContain("import.upload.success.title");
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
