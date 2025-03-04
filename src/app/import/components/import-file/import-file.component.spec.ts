import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
} from "@angular/core/testing";
import { buildTestModuleMetadata } from "../../../../spec-helpers";
import { ImportFileSubscriptionDetailsService } from "../../services/import-file-subscription-details.service";
import { EmptyFileError } from "../../services/import-file.service";
import { ImportFileComponent } from "./import-file.component";

describe("ImportFileComponent", () => {
  let component: ImportFileComponent;
  let fixture: ComponentFixture<ImportFileComponent>;
  let element: HTMLElement;
  let fileServiceMock: jasmine.SpyObj<ImportFileSubscriptionDetailsService>;
  let resolveResult: (
    result: Awaited<
      ReturnType<ImportFileSubscriptionDetailsService["parseAndVerify"]>
    >,
  ) => void;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [ImportFileComponent],
        providers: [
          ImportFileSubscriptionDetailsService,
          {
            provide: ImportFileSubscriptionDetailsService,
            useFactory() {
              fileServiceMock = jasmine.createSpyObj(
                "ImportFileSubscriptionDetailsService",
                ["parseAndVerify"],
              );

              fileServiceMock.parseAndVerify.and.returnValue(
                new Promise((resolve) => (resolveResult = resolve)),
              );

              return fileServiceMock;
            },
          },
        ],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(ImportFileComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it("does not show error & allows proceeding if successfully verified", () => {
    uploadFile();
    resolveResult({
      entries: [
        {
          eventId: 10,
          personId: 100,
          personEmail: "s1@test.ch",
          subscriptionDetailId: 1100000,
          value: "Lorem ipsum",
        },
      ],
      error: null,
    });
    fixture.detectChanges();

    const input = getUploadField();
    expect(input.classList).toContain("is-valid");
    expect(input.classList).not.toContain("is-invalid");

    const error = getErrorElement();
    expect(error).toBeNull();

    const nextButton = getNextButton();
    expect(nextButton.disabled).toBe(false);
  });

  it("shows error & disables proceeding if verification failed", fakeAsync(() => {
    uploadFile();
    resolveResult({
      entries: [
        {
          eventId: 10,
          personId: null,
          personEmail: "s1@test.ch",
          subscriptionDetailId: 1100000,
          value: "Lorem ipsum",
        },
      ],
      error: new EmptyFileError(),
    });
    flush();
    fixture.detectChanges();

    const input = getUploadField();
    expect(input.classList).not.toContain("is-valid");
    expect(input.classList).toContain("is-invalid");

    const error = getErrorElement();
    expect(error).not.toBeNull();
    expect(error?.textContent?.trim()).toBe(
      "import.file.errors.EmptyFileError",
    );

    const nextButton = getNextButton();
    expect(nextButton.disabled).toBe(true);
  }));

  function uploadFile() {
    const files = [
      new File([], "entries.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
    ];
    component.onFileInput({
      item: (i: number) => files[i],
      get length() {
        return files.length;
      },
    });
  }

  function getUploadField(): HTMLInputElement {
    const input = element.querySelector<HTMLInputElement>("#formFile");
    expect(input).not.toBeNull();
    return input!;
  }

  function getErrorElement(): Option<HTMLElement> {
    return element.querySelector(".invalid-feedback");
  }

  function getNextButton(): HTMLButtonElement {
    const button = Array.from(
      element.querySelectorAll<HTMLButtonElement>("button"),
    ).find((e) => e.textContent?.trim() === "import.file.next")!;
    expect(button).not.toBeNull();
    return button;
  }
});
