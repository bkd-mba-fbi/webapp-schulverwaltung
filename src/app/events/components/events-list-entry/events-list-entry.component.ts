import { DatePipe } from "@angular/common";
import { Component, computed, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { convertLink } from "src/app/shared/utils/url";
import { EventEntry } from "../../services/events-state.service";

@Component({
  selector: "bkd-events-list-entry",
  standalone: true,
  imports: [RouterLink, DatePipe, TranslateModule],
  templateUrl: "./events-list-entry.component.html",
  styleUrl: "./events-list-entry.component.scss",
})
export class EventsListEntryComponent {
  event = input.required<EventEntry>();
  withRatings = input<boolean>(true);

  link = computed(() => convertLink(this.event().detailLink));
}
