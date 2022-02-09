import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MyAbsencesService } from '../../services/my-absences.service';

@Component({
  selector: 'erz-my-absences',
  templateUrl: './my-absences.component.html',
  styleUrls: ['./my-absences.component.scss'],
  providers: [MyAbsencesService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyAbsencesComponent {
  constructor() {}
}
