import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DropDownItem } from 'src/app/shared/models/drop-down-item.model';

@Component({
  selector: 'erz-dossier-grades-edit',
  templateUrl: './dossier-grades-edit.component.html',
  styleUrls: ['./dossier-grades-edit.component.scss'],
})
export class DossierGradesEditComponent {
  @Input() designation: string;
  @Input() gradeId: Maybe<number>;
  @Input() gradeOptions: Maybe<DropDownItem[]>;

  constructor(public activeModal: NgbActiveModal) {}
}
