import { DatePipe, NgIf } from "@angular/common";
import { Component, Input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { EventEntry } from "../../services/events-state.service";

@Component({
  selector: "bkd-events-list-entry",
  standalone: true,
  imports: [NgIf, RouterLink, DatePipe, TranslateModule],
  templateUrl: "./events-list-entry.component.html",
  styleUrl: "./events-list-entry.component.scss",
})
export class EventsListEntryComponent {
  @Input() event: EventEntry;
  @Input() withRatings = true;
}
