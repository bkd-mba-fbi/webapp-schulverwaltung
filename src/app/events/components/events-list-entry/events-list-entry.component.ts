import { DatePipe } from "@angular/common";
import { Component, Input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { EventEntry } from "../../services/events-state.service";

@Component({
  selector: "bkd-events-list-entry",
  imports: [RouterLink, DatePipe, TranslatePipe],
  templateUrl: "./events-list-entry.component.html",
  styleUrl: "./events-list-entry.component.scss",
})
export class EventsListEntryComponent {
  @Input() event: EventEntry;
  @Input() withRatings = true;
}
