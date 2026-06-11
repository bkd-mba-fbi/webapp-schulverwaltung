import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  ButtonGroupComponent,
  ButtonGroupOption,
} from "src/app/shared/components/button-group/button-group.component";

export type EventScope = "current" | "past";

@Component({
  selector: "bkd-events-scope-select",
  imports: [ButtonGroupComponent],
  templateUrl: "./events-scope-select.component.html",
  styleUrl: "./events-scope-select.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsScopeSelectComponent {
  private translate = inject(TranslateService);

  value = model.required<EventScope>();

  scopeOptions: ReadonlyArray<ButtonGroupOption<EventScope>> = [
    { key: "current", label: this.translate.instant("events.scopes.current") },
    { key: "past", label: this.translate.instant("events.scopes.past") },
  ];
}
