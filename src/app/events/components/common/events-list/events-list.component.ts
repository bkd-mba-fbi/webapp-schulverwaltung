import { AsyncPipe } from "@angular/common";
import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
} from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { ResettableInputComponent } from "../../../../shared/components/resettable-input/resettable-input.component";
import { SpinnerComponent } from "../../../../shared/components/spinner/spinner.component";
import { StorageService } from "../../../../shared/services/storage.service";
import {
  EventEntry,
  EventsStateService,
} from "../../../services/events-state.service";
import { EventsListEntryComponent } from "../events-list-entry/events-list-entry.component";

const BASE_SEARCH_FIELDS: ReadonlyArray<keyof EventEntry> = ["designation"];
const WITH_RATINGS_SEARCH_FIELDS: ReadonlyArray<keyof EventEntry> = [
  ...BASE_SEARCH_FIELDS,
  "evaluationText",
];

@Component({
  selector: "bkd-events-list",
  templateUrl: "./events-list.component.html",
  styleUrls: ["./events-list.component.scss"],
  imports: [
    ResettableInputComponent,
    SpinnerComponent,
    AsyncPipe,
    TranslatePipe,
    EventsListEntryComponent,
  ],
})
export class EventsListComponent implements OnChanges {
  state = inject(EventsStateService);
  private storage = inject(StorageService);

  @Input() withRatings = true;

  constructor() {
    this.state.setRoles(this.storage.getPayload()?.roles ?? null);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["withRatings"]) {
      this.state.setSearchFields(
        changes["withRatings"].currentValue
          ? WITH_RATINGS_SEARCH_FIELDS
          : BASE_SEARCH_FIELDS,
      );
    }
  }
}
