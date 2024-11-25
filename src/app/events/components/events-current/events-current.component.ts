import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "bkd-events-current",
  template: `<router-outlet></router-outlet>`,
  imports: [RouterOutlet],
})
export class EventsCurrentComponent {
  constructor() {}
}
