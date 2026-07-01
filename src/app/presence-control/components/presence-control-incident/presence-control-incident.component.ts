import {
  Component,
  computed,
  inject,
  input,
  linkedSignal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { PresenceType } from "../../../shared/models/presence-type.model";

interface IncidentOption {
  id: Option<number>;
  label: Option<string>;
}

@Component({
  selector: "bkd-presence-control-incident",
  templateUrl: "./presence-control-incident.component.html",
  imports: [FormsModule, TranslatePipe],
})
export class PresenceControlIncidentComponent {
  activeModal = inject(NgbActiveModal);
  private translate = inject(TranslateService);

  readonly incidentTypes = input.required<ReadonlyArray<PresenceType>>();
  readonly incident = input<Option<PresenceType>>(null);

  readonly incidentOptions = computed(() => [
    this.createIncidentOption(),
    ...this.incidentTypes().map((incidentType) =>
      this.createIncidentOption(incidentType),
    ),
  ]);
  readonly selected = linkedSignal(
    () =>
      this.incidentOptions().find(
        (option) => option.id === this.incident()?.Id,
      ) ?? this.createIncidentOption(),
  );

  createIncidentOption(incidentType?: PresenceType): IncidentOption {
    return {
      id: incidentType ? incidentType.Id : null,
      label: incidentType
        ? incidentType.Designation
        : this.translate.instant("presence-control.incident.no-incident"),
    };
  }
}
