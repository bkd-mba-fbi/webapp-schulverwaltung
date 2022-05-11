import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Test } from 'src/app/shared/models/test.model';

@Component({
  selector: 'erz-dossier-grades-edit',
  templateUrl: './dossier-grades-edit.component.html',
  styleUrls: ['./dossier-grades-edit.component.scss'],
})
export class DossierGradesEditComponent {
  @Input() test: Test;

  constructor(public activeModal: NgbActiveModal) {}
}
