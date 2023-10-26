import { Component, OnInit, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { PresenceType } from "../../../shared/models/presence-type.model";
import { TranslateService } from "@ngx-translate/core";

interface IncidentOption {
  id: Option<number>;
  label: Option<string>;
}

@Component({
  selector: "erz-presence-control-incident",
  templateUrl: "./presence-control-incident.component.html",
  styleUrls: ["./presence-control-incident.component.scss"],
})
export class PresenceControlIncidentComponent implements OnInit {
  @Input() incident: Option<PresenceType>;
  @Input() incidentTypes: ReadonlyArray<PresenceType>;
  incidentOptions: Array<IncidentOption> = [];
  selected: IncidentOption;

  constructor(
    public activeModal: NgbActiveModal,
    private translate: TranslateService,
  ) {}

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
