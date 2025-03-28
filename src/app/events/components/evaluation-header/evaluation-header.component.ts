import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { BacklinkComponent } from "src/app/shared/components/backlink/backlink.component";
import { Event } from "src/app/shared/models/event.model";

@Component({
  selector: "bkd-evaluation-header",
  imports: [BacklinkComponent, TranslatePipe],
  templateUrl: "./evaluation-header.component.html",
  styleUrl: "./evaluation-header.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluationHeaderComponent {
  event = input.required<Event>();
}
