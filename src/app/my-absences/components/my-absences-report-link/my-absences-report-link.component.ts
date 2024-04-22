import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "bkd-my-absences-report-link",
  templateUrl: "./my-absences-report-link.component.html",
  styleUrls: ["./my-absences-report-link.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink, TranslateModule],
})
export class MyAbsencesReportLinkComponent {
  @ViewChild("link") link: ElementRef<HTMLElement>;

  @HostListener("click", ["$event"])
  onClick(): void {
    this.link.nativeElement.click();
  }

  constructor() {}
}
