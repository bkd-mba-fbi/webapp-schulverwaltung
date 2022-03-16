import { Component, Input, OnInit } from '@angular/core';
import { Test } from 'src/app/shared/models/test.model';

@Component({
  selector: 'erz-tests-add-header',
  templateUrl: './tests-add-header.component.html',
  styleUrls: ['./tests-add-header.component.scss'],
})
export class TestsAddHeaderComponent {
  @Input() tests: ReadonlyArray<Test> = [];

  constructor() {}
}
