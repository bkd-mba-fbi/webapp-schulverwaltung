import { TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "../../../spec-helpers";
import { DecimalOrDashPipe } from "./decimal-or-dash.pipe";

describe("DecimalOrDashPipe", () => {
  let pipe: DecimalOrDashPipe;

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [DecimalOrDashPipe],
      }),
    );
    pipe = TestBed.inject(DecimalOrDashPipe);
  });

  it("returns dash for empty string", () => {
    expect(pipe.transform("")).toBe("–");
  });

  it("returns dash for zero string", () => {
    expect(pipe.transform("0")).toBe("–");
  });

  it("returns dash for zero number", () => {
    expect(pipe.transform(0)).toBe("–");
  });

  it("returns dash for undefined", () => {
    expect(pipe.transform(undefined)).toBe("–");
  });

  it("returns dash for null", () => {
    expect(pipe.transform(null)).toBe("–");
  });

  it("returns dash for any non-number string", () => {
    expect(pipe.transform("foobar")).toBe("–");
  });

  it("returns value for number", () => {
    expect(pipe.transform(123)).toBe("123.0");
  });

  it("returns value for decimal number", () => {
    expect(pipe.transform(123.456789)).toBe("123.457");
  });

  it("returns value for decimal number with custom fraction digits", () => {
    expect(pipe.transform(123.456789, 2)).toBe("123.46");
    expect(pipe.transform(123, 2)).toBe("123.00");

    expect(pipe.transform(123.456789, "0-2")).toBe("123.46");
    expect(pipe.transform(123, "0-2")).toBe("123");

    expect(pipe.transform(123.456789, "1-3")).toBe("123.457");
    expect(pipe.transform(123, "1-3")).toBe("123.0");
  });
});
