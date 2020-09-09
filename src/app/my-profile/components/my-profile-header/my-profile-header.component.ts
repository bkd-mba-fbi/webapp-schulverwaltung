import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  OnChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ReplaySubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { Person } from '../../../shared/models/person.model';
import { ReportsService } from '../../../shared/services/reports.service';

@Component({
  selector: 'erz-my-profile-header',
  templateUrl: './my-profile-header.component.html',
  styleUrls: ['./my-profile-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProfileHeaderComponent implements OnInit, OnChanges {
  @Input() student?: Person;

  private studentId$ = new ReplaySubject<Option<number>>(1);

  reportUrl$ = combineLatest([
    this.reportsService.personMasterDataAvailability$,
    this.studentId$,
  ]).pipe(
    map(([available, studentId]) =>
      available && studentId
        ? this.reportsService.getPersonMasterDataUrl(studentId)
        : null
    )
  );

  constructor(private reportsService: ReportsService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.student) {
      this.studentId$.next(changes.student.currentValue?.Id || null);
    }
  }
}
