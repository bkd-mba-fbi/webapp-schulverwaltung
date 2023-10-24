import { Component, ChangeDetectionStrategy } from '@angular/core';
import { OpenAbsencesService } from '../../services/open-absences.service';
import { CONFIRM_ABSENCES_SERVICE } from 'src/app/shared/tokens/confirm-absences-service';

@Component({
  selector: 'erz-open-absences',
  templateUrl: './open-absences.component.html',
  styleUrls: ['./open-absences.component.scss'],
  providers: [
    OpenAbsencesService,
    {
      provide: CONFIRM_ABSENCES_SERVICE,
      useExisting: OpenAbsencesService,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpenAbsencesComponent {
  constructor() {}
}
