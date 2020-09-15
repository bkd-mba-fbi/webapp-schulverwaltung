import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MyAbsencesReportStateService } from '../../services/my-absences-report-state.service';
import { MyAbsencesReportSelectionService } from '../../services/my-absences-report-selection.service';

@Component({
  selector: 'erz-my-absences-report',
  templateUrl: './my-absences-report.component.html',
  styleUrls: ['./my-absences-report.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MyAbsencesReportStateService, MyAbsencesReportSelectionService],
})
export class MyAbsencesReportComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
