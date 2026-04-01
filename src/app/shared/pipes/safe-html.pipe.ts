import { Pipe, PipeTransform, inject } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import DOMPurify from "dompurify";

@Pipe({
  name: "bkdSafeHtml",
})
export class SafeHtmlPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  transform(value: Option<string>): SafeHtml {
    if (!value) return "";

    // Make sure the given HTML is sanitized to avoid XSS and only allow only a
    // subset of HTML.
    const saneHtml = DOMPurify.sanitize(value, {
      ALLOWED_TAGS: [
        "a",
        "b",
        "blockquote",
        "br",
        "code",
        "del",
        "em",
        "hr",
        "i",
        "li",
        "ol",
        "p",
        "pre",
        "s",
        "span",
        "strong",
        "sub",
        "sup",
        "u",
        "ul",
      ],
      ALLOWED_ATTR: ["href", "title", "target", "rel"],
    });

    return this.sanitizer.bypassSecurityTrustHtml(saneHtml);
  }
}
