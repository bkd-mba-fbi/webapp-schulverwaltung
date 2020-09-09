import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PresenceTypesService } from 'src/app/shared/services/presence-types.service';

@Component({
  selector: 'erz-presence-control-incident',
  templateUrl: './presence-control-incident.component.html',
  styleUrls: ['./presence-control-incident.component.scss'],
})
export class PresenceControlIncidentComponent implements OnInit {
  incidentTypes$ = this.presenceTypesService.incidentTypes$;

  constructor(
    public activeModal: NgbActiveModal,
    private presenceTypesService: PresenceTypesService
  ) {}

  ngOnInit(): void {}
}
