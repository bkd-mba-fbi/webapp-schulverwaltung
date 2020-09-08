import { Component, Input, OnInit } from '@angular/core';
import { Person } from '../../../shared/models/person.model';
import { ReportsService } from '../../../shared/services/reports.service';

@Component({
  selector: 'erz-my-profile-header',
  templateUrl: './my-profile-header.component.html',
  styleUrls: ['./my-profile-header.component.scss'],
})
export class MyProfileHeaderComponent implements OnInit {
  @Input() student?: Person;

  public reportUrl = this.reportsService.personMasterDataReportUrl;

  constructor(private reportsService: ReportsService) {}

  ngOnInit(): void {}
}
