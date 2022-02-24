import { Component, Input, OnInit } from '@angular/core';
import { Test } from 'src/app/shared/models/test.model';

@Component({
  selector: 'erz-tests-add-entry',
  templateUrl: './tests-add-entry.component.html',
  styleUrls: ['./tests-add-entry.component.scss'],
})
export class TestsAddEntryComponent {
  @Input() test: Test;

  constructor() {}
}
