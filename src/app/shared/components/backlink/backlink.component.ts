import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
} from "@angular/core";
import { Params, RouterLink } from "@angular/router";

@Component({
  selector: "erz-backlink",
  templateUrl: "./backlink.component.html",
  styleUrls: ["./backlink.component.scss"],
})
export class BacklinkComponent implements AfterViewInit, OnDestroy {
  @Input()
  routerLink: RouterLink["routerLink"] = [];

  @Input()
  queryParams?: Params | null;

  constructor(private element: ElementRef) {}

  ngAfterViewInit(): void {
    // Since the component itself has a `routerLink` input, stop
    // bubbling to avoid navigation when clicking on other elements
    // than the actual <a> itself.
    this.element.nativeElement.addEventListener(
      "click",
      this.stopPropagation,
      true,
    );
  }

  ngOnDestroy(): void {
    this.element.nativeElement.removeEventListener(
      "click",
      this.stopPropagation,
      true,
    );
  }

  private stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }
}
