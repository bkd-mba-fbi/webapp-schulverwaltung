import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import { Component, Input } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { ResettableInputComponent } from "../../../shared/components/resettable-input/resettable-input.component";
import { SpinnerComponent } from "../../../shared/components/spinner/spinner.component";
import { LetDirective } from "../../../shared/directives/let.directive";
import { StorageService } from "../../../shared/services/storage.service";
import { EventsStateService } from "../../services/events-state.service";
import { EventsListEntryComponent } from "../events-list-entry/events-list-entry.component";

@Component({
  selector: "bkd-events-list",
  templateUrl: "./events-list.component.html",
  styleUrls: ["./events-list.component.scss"],
  standalone: true,
  imports: [
    LetDirective,
    ResettableInputComponent,
    NgIf,
    NgFor,
    SpinnerComponent,
    AsyncPipe,
    TranslateModule,
    EventsListEntryComponent,
  ],
})
export class EventsListComponent {
  @Input() withRatings: boolean = true;
  constructor(
    public state: EventsStateService,
    private storage: StorageService,
  ) {
    this.state.setRoles(this.storage.getPayload()?.roles ?? null);
  }
}
