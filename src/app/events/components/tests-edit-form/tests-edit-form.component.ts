import { Component, Input } from '@angular/core';

@Component({
  selector: 'erz-tests-edit-form',
  templateUrl: './tests-edit-form.component.html',
  styleUrls: ['./tests-edit-form.component.scss'],
})
export class TestsEditFormComponent {
  @Input() courseId: Number;

  constructor() {}
}
