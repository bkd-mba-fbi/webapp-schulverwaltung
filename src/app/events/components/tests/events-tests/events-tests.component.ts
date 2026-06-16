import { ChangeDetectionStrategy, Component } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { EventsListComponent } from "../../common/events-list/events-list.component";

@Component({
  selector: "bkd-events-tests",
  templateUrl: "./events-tests.component.html",
  styleUrls: ["./events-tests.component.scss"],
  imports: [EventsListComponent, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsTestsComponent {
  constructor() {}
}
