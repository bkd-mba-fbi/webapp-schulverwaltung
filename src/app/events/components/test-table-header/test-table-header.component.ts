import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Test } from 'src/app/shared/models/test.model';

@Component({
  selector: 'erz-test-table-header',
  templateUrl: './test-table-header.component.html',
  styleUrls: ['./test-table-header.component.scss'],
})
export class TestTableHeaderComponent {
  @Input() test: Test;
  @Input() expanded: boolean;

  @Output() toggle = new EventEmitter<boolean>();

  constructor() {}

  toggleHeader() {
    this.toggle.emit(!this.expanded);
  }
}
