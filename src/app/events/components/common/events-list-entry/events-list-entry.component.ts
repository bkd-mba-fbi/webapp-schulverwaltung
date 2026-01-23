import { DatePipe } from "@angular/common";
import { Component, computed, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { convertLink } from "src/app/shared/utils/url";
import { EventEntry } from "../../../services/events-state.service";

@Component({
  selector: "bkd-events-list-entry",
  imports: [RouterLink, DatePipe, TranslatePipe],
  templateUrl: "./events-list-entry.component.html",
  styleUrl: "./events-list-entry.component.scss",
  host: {
    "[class.with-ratings]": "withRatings()",
    "[class.with-date]": "withDate()",
  },
})
export class EventsListEntryComponent {
  event = input.required<EventEntry>();
  withRatings = input<boolean>(true);
  withDate = input<boolean>(true);

  link = computed(() => convertLink(this.event().detailLink));
}
