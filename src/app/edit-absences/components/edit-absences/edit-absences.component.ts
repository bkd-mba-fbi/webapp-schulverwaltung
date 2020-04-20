import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { EditAbsencesStateService } from '../../services/edit-absences-state.service';

@Component({
  selector: 'erz-edit-absences',
  templateUrl: './edit-absences.component.html',
  styleUrls: ['./edit-absences.component.scss'],
  providers: [EditAbsencesStateService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditAbsencesComponent implements OnInit {
  constructor(public state: EditAbsencesStateService) {}

  ngOnInit(): void {}
}
