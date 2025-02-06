import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  viewChild,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: "bkd-my-absences-report-link",
  templateUrl: "./my-absences-report-link.component.html",
  styleUrls: ["./my-absences-report-link.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TranslatePipe],
})
export class MyAbsencesReportLinkComponent {
  readonly link = viewChild.required<ElementRef<HTMLElement>>("link");

  @HostListener("click", ["$event"])
  onClick(): void {
    this.link().nativeElement.click();
  }

  constructor() {}
}
