import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Student } from '../../models/student.model';
import { Person } from '../../models/person.model';

@Component({
  selector: 'erz-student-profile-address',
  templateUrl: './student-profile-address.component.html',
  styleUrls: ['./student-profile-address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentProfileAddressComponent implements OnInit {
  @Input() student: Student | Person;

  constructor() {}

  ngOnInit(): void {}

  get postalCode(): Option<string> {
    return Student.is(this.student)
      ? this.student.PostalCode
      : this.student.Zip;
  }
}
