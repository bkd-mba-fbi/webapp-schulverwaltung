import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'erz-presence-control-preceding-absence',
  templateUrl: './presence-control-preceding-absence.component.html',
  styleUrls: ['./presence-control-preceding-absence.component.scss'],
})
export class PresenceControlPrecedingAbsenceComponent implements OnInit {
  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {}
}
