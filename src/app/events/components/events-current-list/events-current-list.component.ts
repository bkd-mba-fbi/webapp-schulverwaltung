import { ChangeDetectionStrategy, Component } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { EventsListComponent } from "../events-list/events-list.component";

@Component({
  selector: "bkd-events-current-list",
  standalone: true,
  imports: [EventsListComponent, TranslateModule],
  templateUrl: "./events-current-list.component.html",
  styleUrl: "./events-current-list.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsCurrentListComponent {}
