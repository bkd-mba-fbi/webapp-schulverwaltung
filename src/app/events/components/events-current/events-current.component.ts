import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "bkd-events-current",
  template: `<router-outlet></router-outlet>`,
  standalone: true,
  imports: [RouterOutlet],
})
export class EventsCurrentComponent {
  constructor() {}
}
