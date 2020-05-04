import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Student } from '../../models/student.model';

@Component({
  selector: 'erz-student-profile-address',
  templateUrl: './student-profile-address.component.html',
  styleUrls: ['./student-profile-address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentProfileAddressComponent implements OnInit {
  @Input() student: Student;

  constructor() {}

  ngOnInit(): void {}
}
