import { AsyncPipe, DatePipe, NgFor, NgIf } from "@angular/common";
import { Component, Input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { ResettableInputComponent } from "../../../shared/components/resettable-input/resettable-input.component";
import { SpinnerComponent } from "../../../shared/components/spinner/spinner.component";
import { LetDirective } from "../../../shared/directives/let.directive";
import { StorageService } from "../../../shared/services/storage.service";
import { EventsStateService } from "../../services/events-state.service";

@Component({
  selector: "erz-events-list",
  templateUrl: "./events-list.component.html",
  styleUrls: ["./events-list.component.scss"],
  standalone: true,
  imports: [
    LetDirective,
    ResettableInputComponent,
    NgIf,
    NgFor,
    RouterLink,
    SpinnerComponent,
    AsyncPipe,
    DatePipe,
    TranslateModule,
  ],
})
export class EventsListComponent {
  @Input() withRatings: boolean = true;
  constructor(
    public state: EventsStateService,
    private storage: StorageService,
  ) {
    this.state.roles$.next(this.storage.getPayload()?.roles);
  }
}
