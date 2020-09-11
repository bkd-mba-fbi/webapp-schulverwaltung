import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PresenceType } from '../../../shared/models/presence-type.model';
import { TranslateService } from '@ngx-translate/core';

interface IncidentOption {
  id: Option<number>;
  label: Option<string>;
}

@Component({
  selector: 'erz-presence-control-incident',
  templateUrl: './presence-control-incident.component.html',
  styleUrls: ['./presence-control-incident.component.scss'],
})
export class PresenceControlIncidentComponent implements OnInit {
  @Input() incidentTypes: ReadonlyArray<PresenceType>;
  incidentOptions: Array<IncidentOption> = [];
  selected: Option<IncidentOption> = null;

  constructor(
    public activeModal: NgbActiveModal,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.incidentOptions = this.incidentTypes.map((incidentType) =>
      this.createIncidentOption(incidentType)
    );

    this.incidentOptions.unshift({
      id: null,
      label: this.translate.instant('presence-control.incident.no-incident'),
    });
  }

  createIncidentOption(incidentType: PresenceType): IncidentOption {
    return {
      id: incidentType.Id,
      label: incidentType.Designation,
    };
  }

  onSelectionChange(option: IncidentOption): void {
    this.selected = option;
  }

  getSelectedIncident(): Maybe<PresenceType> {
    return this.incidentTypes.find((type) => type.Id === this.selected?.id);
  }
}
