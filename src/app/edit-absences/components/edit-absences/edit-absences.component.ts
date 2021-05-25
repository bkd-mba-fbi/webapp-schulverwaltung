import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { EditAbsencesStateService } from '../../services/edit-absences-state.service';
import { CONFIRM_ABSENCES_SERVICE } from 'src/app/shared/tokens/confirm-absences-service';
import { STUDENT_PROFILE_BACKLINK } from 'src/app/shared/tokens/student-profile-backlink';

@Component({
  selector: 'erz-edit-absences',
  templateUrl: './edit-absences.component.html',
  styleUrls: ['./edit-absences.component.scss'],
  providers: [
    EditAbsencesStateService,
    {
      provide: CONFIRM_ABSENCES_SERVICE,
      useExisting: EditAbsencesStateService,
    },
    { provide: STUDENT_PROFILE_BACKLINK, useValue: '/edit-absences' },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditAbsencesComponent implements OnInit {
  constructor(public state: EditAbsencesStateService) {}

  ngOnInit(): void {}
}
