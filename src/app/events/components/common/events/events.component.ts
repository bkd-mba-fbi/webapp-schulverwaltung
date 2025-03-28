import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { EventsStateService } from "src/app/events/services/events-state.service";
import { ConfirmAbsencesSelectionService } from "src/app/shared/services/confirm-absences-selection.service";

@Component({
  selector: "bkd-events",
  templateUrl: "./events.component.html",
  styleUrls: ["./events.component.scss"],
  imports: [RouterOutlet],
  providers: [EventsStateService, ConfirmAbsencesSelectionService],
})
export class EventsComponent {
  constructor() {}
}
