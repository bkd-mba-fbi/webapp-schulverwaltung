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
  @Input() emailProperty: 'DisplayEmail' | 'Email2' = 'DisplayEmail';

  constructor() {}

  ngOnInit(): void {}

  get postalCode(): Option<string> {
    return 'PostalCode' in this.student
      ? this.student.PostalCode
      : this.student.Zip;
  }

  get email(): Option<string> {
    if (this.emailProperty === 'Email2' && 'Email2' in this.student) {
      return this.student.Email2 || null;
    }
    return this.student.DisplayEmail;
  }
}
