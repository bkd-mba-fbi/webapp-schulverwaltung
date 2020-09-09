import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'erz-presence-control-incident',
  templateUrl: './presence-control-incident.component.html',
  styleUrls: ['./presence-control-incident.component.scss'],
})
export class PresenceControlIncidentComponent implements OnInit {
  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {}
}
