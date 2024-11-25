import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { EventsStudentsStateService } from "../../services/events-students-state.service";

@Component({
  selector: "bkd-events-students",
  imports: [RouterOutlet],
  providers: [EventsStudentsStateService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: "<router-outlet></router-outlet>",
})
export class EventsStudentsComponent {}
