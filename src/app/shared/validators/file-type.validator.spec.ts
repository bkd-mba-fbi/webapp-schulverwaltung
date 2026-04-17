import { WritableSignal, signal } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { FieldTree, form } from "@angular/forms/signals";
import { fileType } from "./file-type.validator";

type Model = {
  file: Option<File>;
};

const ACCEPTED_FILE_TYPES = ["application/pdf", "image/png"] as const;

describe("fileType", () => {
  let model: WritableSignal<Model>;
  let testForm: FieldTree<Model>;

  beforeEach(() => {
    testForm = TestBed.runInInjectionContext(() => {
      model = signal<Model>({ file: null });
      return form(model, (schema) => {
        fileType(schema.file, { acceptedFileTypes: ACCEPTED_FILE_TYPES });
      });
    });
  });

  it("is valid when file is null", () => {
    testForm.file().value.set(null);

    expect(testForm.file().valid()).toBe(true);
    expect(testForm.file().errors().length).toBe(0);
  });

  it("is valid for a file with an accepted PDF type", () => {
    const pdfFile = new File(["content"], "doc.pdf", {
      type: "application/pdf",
    });
    testForm.file().value.set(pdfFile);

    expect(testForm.file().valid()).toBe(true);
    expect(testForm.file().errors().length).toBe(0);
  });

  it("is valid for a file with an accepted PNG type", () => {
    const pngFile = new File(["content"], "image.png", {
      type: "image/png",
    });
    testForm.file().value.set(pngFile);

    expect(testForm.file().valid()).toBe(true);
    expect(testForm.file().errors().length).toBe(0);
  });

  it("is invalid for a file with a disallowed type", () => {
    const exeFile = new File(["content"], "bad.exe", {
      type: "application/vnd.microsoft.portable-executable",
    });
    testForm.file().value.set(exeFile);

    expect(testForm.file().valid()).toBe(false);
    const errors = testForm.file().errors();
    expect(errors.length).toBe(1);
    const error = errors[0] as unknown as {
      kind: string;
      message: string;
    };
    expect(error.kind).toBe("fileType");
    expect(error.message).toContain("not allowed");
  });

  describe("with 'when' condition", () => {
    it("is valid when 'when' condition returns false", () => {
      testForm = TestBed.runInInjectionContext(() => {
        return form(model, (schema) => {
          fileType(schema.file, {
            acceptedFileTypes: ACCEPTED_FILE_TYPES,
            when: () => false,
          });
        });
      });

      const exeFile = new File(["content"], "bad.exe", {
        type: "application/vnd.microsoft.portable-executable",
      });
      testForm.file().value.set(exeFile);

      expect(testForm.file().valid()).toBe(true);
      expect(testForm.file().errors().length).toBe(0);
    });

    it("is invalid when 'when' condition returns true", () => {
      testForm = TestBed.runInInjectionContext(() => {
        return form(model, (schema) => {
          fileType(schema.file, {
            acceptedFileTypes: ACCEPTED_FILE_TYPES,
            when: () => true,
          });
        });
      });

      const exeFile = new File(["content"], "bad.exe", {
        type: "application/vnd.microsoft.portable-executable",
      });
      testForm.file().value.set(exeFile);

      expect(testForm.file().valid()).toBe(false);
      const errors = testForm.file().errors();
      expect(errors.length).toBe(1);
      const error = errors[0] as unknown as { kind: string };
      expect(error.kind).toBe("fileType");
    });
  });
});
