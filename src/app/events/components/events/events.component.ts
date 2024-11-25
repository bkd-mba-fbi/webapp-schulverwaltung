import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ConfirmAbsencesSelectionService } from "../../../shared/services/confirm-absences-selection.service";
import { EventsStateService } from "../../services/events-state.service";

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
