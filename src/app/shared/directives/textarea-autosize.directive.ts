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

  ngAfterViewInit() {
    if (this.elementRef.nativeElement.scrollHeight) {
      setTimeout(() => this.resize());
    }
  }

  resize() {
    this.elementRef.nativeElement.style.height = "0";
    this.elementRef.nativeElement.style.height =
      this.elementRef.nativeElement.scrollHeight + 3 + "px";
  }
}
