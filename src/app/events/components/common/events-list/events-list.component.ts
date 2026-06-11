import { AsyncPipe } from "@angular/common";
import { Component, effect, inject, input } from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { TranslatePipe } from "@ngx-translate/core";
import { switchMap } from "rxjs";
import { ResettableInputComponent } from "../../../../shared/components/resettable-input/resettable-input.component";
import { SpinnerComponent } from "../../../../shared/components/spinner/spinner.component";
import { StorageService } from "../../../../shared/services/storage.service";
import {
  EventEntry,
  EventsStateService,
} from "../../../services/events-state.service";
import { EventsListEntryComponent } from "../events-list-entry/events-list-entry.component";
import { EventsScopeSelectComponent } from "../events-scope-select/events-scope-select.component";

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
    EventsScopeSelectComponent,
  ],
})
export class EventsListComponent {
  state = inject(EventsStateService);
  private storage = inject(StorageService);

  withRatings = input(true);

  entries = toSignal(this.loadEntries(), { initialValue: [] });

  constructor() {
    this.state.setRoles(this.storage.getPayload()?.roles ?? null);

    effect(() => {
      const withRatings = this.withRatings();
      this.state.setSearchFields(
        withRatings ? WITH_RATINGS_SEARCH_FIELDS : BASE_SEARCH_FIELDS,
      );
    });
  }

  private loadEntries() {
    return toObservable(this.withRatings).pipe(
      switchMap((withRatings) => this.state.getEntries(withRatings)),
    );
  }
}
