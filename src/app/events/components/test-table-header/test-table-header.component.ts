import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Output() publish = new EventEmitter<Test>();
  @Output() unpublish = new EventEmitter<Test>();

  constructor() {}

  toggleHeader() {
    this.toggle.emit(!this.expanded);
  }

  publishTest() {
    this.publish.emit(this.test);
  }

  unpublishTest() {
    this.unpublish.emit(this.test);
  }
}
