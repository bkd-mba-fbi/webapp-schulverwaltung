import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Person } from '../../models/person.model';

@Component({
  selector: 'erz-student-profile-legal-representative',
  templateUrl: './student-profile-legal-representative.component.html',
  styleUrls: ['./student-profile-legal-representative.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentProfileLegalRepresentativeComponent {
  @Input() person: Person;

  constructor() {}
}
