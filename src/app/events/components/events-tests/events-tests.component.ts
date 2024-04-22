import { Component } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { EventsListComponent } from "../events-list/events-list.component";

@Component({
  selector: "bkd-events-tests",
  templateUrl: "./events-tests.component.html",
  styleUrls: ["./events-tests.component.scss"],
  standalone: true,
  imports: [EventsListComponent, TranslateModule],
})
export class EventsTestsComponent {
  constructor() {}
}
