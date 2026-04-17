import { WritableSignal, signal } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { FieldTree, form } from "@angular/forms/signals";
import { maxFileSize } from "./max-file-size.validator";

type Model = {
  file: Option<File>;
};

describe("maxFileSize", () => {
  let model: WritableSignal<Model>;
  let testForm: FieldTree<Model>;

  beforeEach(() => {
    testForm = TestBed.runInInjectionContext(() => {
      model = signal<Model>({ file: null });
      return form(model, (schema) => {
        maxFileSize(schema.file, { maxBytes: 1024 * 1024 });
      });
    });
  });

  it("is valid when file is null", () => {
    testForm.file().value.set(null);

    expect(testForm.file().valid()).toBe(true);
    expect(testForm.file().errors().length).toBe(0);
  });

  it("is valid for a file that is smaller than the max size", () => {
    const smallFile = new File(["x".repeat(500 * 1024)], "small.txt", {
      type: "text/plain",
    });
    testForm.file().value.set(smallFile);

    expect(testForm.file().valid()).toBe(true);
    expect(testForm.file().errors().length).toBe(0);
  });

  it("is invalid for a file that is larger than the max size", () => {
    const largeFile = new File(["x".repeat(2 * 1024 * 1024)], "large.txt", {
      type: "text/plain",
    });
    testForm.file().value.set(largeFile);

    expect(testForm.file().valid()).toBe(false);
    const errors = testForm.file().errors();
    expect(errors.length).toBe(1);
    const error = errors[0] as unknown as {
      kind: string;
      message: string;
      size: string;
      maxSize: string;
    };
    expect(error.kind).toBe("maxFileSize");
    expect(error.message).toContain("too large");
    expect(error.size).toBe("2.0");
    expect(error.maxSize).toBe("1.0");
  });

  it("is valid when file size equals max size", () => {
    const exactFile = new File(["x".repeat(1024 * 1024)], "exact.txt", {
      type: "text/plain",
    });
    testForm.file().value.set(exactFile);

    expect(testForm.file().valid()).toBe(true);
    expect(testForm.file().errors().length).toBe(0);
  });

  describe("with 'when' condition", () => {
    it("is valid when 'when' condition returns false", () => {
      testForm = TestBed.runInInjectionContext(() => {
        return form(model, (schema) => {
          maxFileSize(schema.file, {
            maxBytes: 1024 * 1024,
            when: () => false,
          });
        });
      });

      const largeFile = new File(["x".repeat(2 * 1024 * 1024)], "large.txt", {
        type: "text/plain",
      });
      testForm.file().value.set(largeFile);

      expect(testForm.file().valid()).toBe(true);
      expect(testForm.file().errors().length).toBe(0);
    });

    it("is invalid when 'when' condition returns true", () => {
      testForm = TestBed.runInInjectionContext(() => {
        return form(model, (schema) => {
          maxFileSize(schema.file, {
            maxBytes: 1024 * 1024,
            when: () => true,
          });
        });
      });

      const largeFile = new File(["x".repeat(2 * 1024 * 1024)], "large.txt", {
        type: "text/plain",
      });
      testForm.file().value.set(largeFile);

      expect(testForm.file().valid()).toBe(false);
      const errors = testForm.file().errors();
      expect(errors.length).toBe(1);
      const error = errors[0] as unknown as { kind: string };
      expect(error.kind).toBe("maxFileSize");
    });
  });
});
