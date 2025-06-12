import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
} from "@angular/core";

@Directive({
  selector: "textarea[bkdTextareaAutosize]",
})
export class TextareaAutosizeDirective implements AfterViewInit {
  constructor(private elementRef: ElementRef) {}

  @HostListener(":input")
  onInput() {
    this.resize();
  }

  @HostListener("window:resize")
  onWindowResize() {
    this.resize();
  }

  ngAfterViewInit() {
    if (this.elementRef.nativeElement.scrollHeight) {
      setTimeout(() => this.resize());
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.resize();
          }
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      },
    );

    observer.observe(this.elementRef.nativeElement);
  }

  resize() {
    this.elementRef.nativeElement.style.height = "0";
    this.elementRef.nativeElement.style.height =
      this.elementRef.nativeElement.scrollHeight + 3 + "px";
  }
}
