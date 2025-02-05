import { Component, Input, OnInit, inject } from "@angular/core";
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
  styleUrls: ["./presence-control-incident.component.scss"],
  imports: [FormsModule, TranslatePipe],
})
export class PresenceControlIncidentComponent implements OnInit {
  activeModal = inject(NgbActiveModal);
  private translate = inject(TranslateService);

  @Input() incident: Option<PresenceType>;
  @Input() incidentTypes: ReadonlyArray<PresenceType>;
  incidentOptions: Array<IncidentOption> = [];
  selected: IncidentOption;

  ngOnInit(): void {
    const emptyOption = this.createIncidentOption();

    this.incidentOptions = this.incidentTypes.map((incidentType) =>
      this.createIncidentOption(incidentType),
    );
    this.incidentOptions.unshift(emptyOption);

    this.selected =
      this.incidentOptions.find((option) => option.id === this.incident?.Id) ||
      emptyOption;
  }

  createIncidentOption(incidentType?: PresenceType): IncidentOption {
    return {
      id: incidentType ? incidentType.Id : null,
      label: incidentType
        ? incidentType.Designation
        : this.translate.instant("presence-control.incident.no-incident"),
    };
  }

  onSelectionChange(option: IncidentOption): void {
    this.selected = option;
  }

  getSelectedIncident(): Option<PresenceType> {
    return (
      this.incidentTypes.find((type) => type.Id === this.selected?.id) || null
    );
  }
}
