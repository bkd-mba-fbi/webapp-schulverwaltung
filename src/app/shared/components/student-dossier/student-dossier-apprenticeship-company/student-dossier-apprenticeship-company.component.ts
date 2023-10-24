import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ApprenticeshipCompany } from '../../../services/student-profile.service';

@Component({
  selector: 'erz-student-dossier-apprenticeship-company',
  templateUrl: './student-dossier-apprenticeship-company.component.html',
  styleUrls: ['./student-dossier-apprenticeship-company.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentDossierApprenticeshipCompanyComponent {
  @Input() company: ApprenticeshipCompany;

  constructor() {}
}
