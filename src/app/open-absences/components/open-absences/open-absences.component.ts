import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { OpenAbsencesService } from '../../services/open-absences.service';

@Component({
  selector: 'erz-open-absences',
  templateUrl: './open-absences.component.html',
  styleUrls: ['./open-absences.component.scss'],
  providers: [OpenAbsencesService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpenAbsencesComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
