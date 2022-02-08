import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ApprenticeshipCompany } from '../../services/student-profile.service';

@Component({
  selector: 'erz-student-profile-apprenticeship-company',
  templateUrl: './student-profile-apprenticeship-company.component.html',
  styleUrls: ['./student-profile-apprenticeship-company.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentProfileApprenticeshipCompanyComponent {
  @Input() company: ApprenticeshipCompany;

  constructor() {}
}
