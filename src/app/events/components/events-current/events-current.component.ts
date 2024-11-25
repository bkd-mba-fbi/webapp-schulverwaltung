import { Component } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { EventsListComponent } from "../events-list/events-list.component";

@Component({
  selector: "bkd-events-current",
  templateUrl: "./events-current.component.html",
  styleUrls: ["./events-current.component.scss"],
  imports: [EventsListComponent, TranslatePipe],
})
export class EventsCurrentComponent {
  constructor() {}
}
