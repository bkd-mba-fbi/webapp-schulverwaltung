import { Component } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { EventsListComponent } from "../events-list/events-list.component";

@Component({
  selector: "bkd-events-tests",
  templateUrl: "./events-tests.component.html",
  styleUrls: ["./events-tests.component.scss"],
  imports: [EventsListComponent, TranslatePipe],
})
export class EventsTestsComponent {
  constructor() {}
}
