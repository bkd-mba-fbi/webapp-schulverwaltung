import { Component, Input } from '@angular/core';
import { Test } from '../../../../shared/models/test.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'erz-tests-delete',
  templateUrl: './tests-delete.component.html',
  styleUrls: ['./tests-delete.component.scss'],
})
export class TestsDeleteComponent {
  @Input() test: Test;
  @Input() canDelete: boolean;

  constructor(public activeModal: NgbActiveModal) {}
}