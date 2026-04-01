import { SecurityContext } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { DomSanitizer } from "@angular/platform-browser";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { SafeHtmlPipe } from "./safe-html.pipe";

describe("SafeHtmlPipe", () => {
  let pipe: SafeHtmlPipe;
  let sanitizer: DomSanitizer;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [SafeHtmlPipe],
      }),
    ).compileComponents();
    pipe = TestBed.inject(SafeHtmlPipe);
    sanitizer = TestBed.inject(DomSanitizer);
  });

  it("returns empty string for null", () => {
    expect(pipe.transform(null)).toBe("");
  });

  it("returns empty string for empty string", () => {
    expect(pipe.transform("")).toBe("");
  });

  it("returns plain text as is", () => {
    const result = pipe.transform("Lorem ipsum");
    expect(sanitizer.sanitize(SecurityContext.HTML, result)).toBe(
      "Lorem ipsum",
    );
  });

  it("returns sanitized simple markup", () => {
    const result = pipe.transform(
      "<p>Lorem <i onclick=\"javascript:alert('xss');\">ipsum</i> <ul><li>Apple</li><li>Pear</li></ul></p>",
    );
    expect(sanitizer.sanitize(SecurityContext.HTML, result)).toBe(
      "<p>Lorem <i>ipsum</i> </p><ul><li>Apple</li><li>Pear</li></ul><p></p>",
    );
  });

  it("returns sanitized HTML links", () => {
    const result = pipe.transform(
      '<a href="javascript:alert(\'xss\');">bad</a> <a href="https://example.com">good</a>',
    );
    expect(sanitizer.sanitize(SecurityContext.HTML, result)).toBe(
      '<a>bad</a> <a href="https://example.com">good</a>',
    );
  });

  it("strips javascript", () => {
    const result = pipe.transform("<script>alert('xss')</script>");
    expect(sanitizer.sanitize(SecurityContext.HTML, result)).toBe("");
  });

  it("strips img tags", () => {
    const result = pipe.transform(
      '<img src="https://example.com/image.png"> <button onclick="javascript:alert(\'xss\')">clickme</button> <svg onload="alert(\'xss\')"> <b onmouseover="alert(\'xss\')">Lorem ipsum</b>',
    );
    expect(sanitizer.sanitize(SecurityContext.HTML, result)).toBe(
      " clickme <b>Lorem ipsum</b>",
    );
  });

  it("strips iframe tags", () => {
    const result = pipe.transform(
      '<iframe src="https://example.com"></iframe>',
    );
    expect(sanitizer.sanitize(SecurityContext.HTML, result)).toBe("");
  });
});
