import { Component } from "@angular/core";
import { EventsStateService } from "../../services/events-state.service";

@Component({
  selector: "erz-events",
  templateUrl: "./events.component.html",
  styleUrls: ["./events.component.scss"],
  providers: [EventsStateService],
})
export class EventsComponent {
  constructor() {}
}
