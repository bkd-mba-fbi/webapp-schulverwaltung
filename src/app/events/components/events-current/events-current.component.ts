import { Component } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { EventsListComponent } from "../events-list/events-list.component";

@Component({
  selector: "bkd-events-current",
  templateUrl: "./events-current.component.html",
  styleUrls: ["./events-current.component.scss"],
  standalone: true,
  imports: [EventsListComponent, TranslateModule],
})
export class EventsCurrentComponent {
  constructor() {}
}
