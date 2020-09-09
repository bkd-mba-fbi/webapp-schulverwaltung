import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { Person } from '../../../shared/models/person.model';
import { ReportsService } from '../../../shared/services/reports.service';

@Component({
  selector: 'erz-my-profile-header',
  templateUrl: './my-profile-header.component.html',
  styleUrls: ['./my-profile-header.component.scss'],
})
export class MyProfileHeaderComponent implements OnInit, OnChanges {
  @Input() student?: Person;

  public reportUrl: Option<string> = null;

  constructor(private reportsService: ReportsService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.student && this.student) {
      this.reportUrl = this.reportsService.getPersonMasterDataReportUrl(
        this.student.Id
      );
    }
  }
}
