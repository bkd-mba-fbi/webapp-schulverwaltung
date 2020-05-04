import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'erz-student-profile-entry-header',
  templateUrl: './student-profile-entry-header.component.html',
  styleUrls: ['./student-profile-entry-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentProfileEntryHeaderComponent implements OnInit {
  @Input() opened = false;

  constructor() {}

  ngOnInit(): void {}
}
