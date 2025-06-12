import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  OnDestroy,
} from "@angular/core";

@Directive({
  selector: "textarea[bkdTextareaAutosize]",
})
export class TextareaAutosizeDirective implements AfterViewInit, OnDestroy {
  private observer?: IntersectionObserver;

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
    // Using IntersectionObserver to ensure proper resizing, when the textarea is initially hidden and then becomes visible when the column is selected in the dropdown.
    this.observer = new IntersectionObserver(
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

    this.observer.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.unobserve(this.elementRef.nativeElement);
    }
  }

  resize() {
    this.elementRef.nativeElement.style.height = "0";
    this.elementRef.nativeElement.style.height =
      this.elementRef.nativeElement.scrollHeight + 3 + "px";
  }
}
