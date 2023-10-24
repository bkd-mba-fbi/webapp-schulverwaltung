import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Params, RouterLink } from '@angular/router';
import { Student } from 'src/app/shared/models/student.model';

@Component({
  selector: 'erz-student-backlink',
  templateUrl: './student-backlink.component.html',
  styleUrls: ['./student-backlink.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentBacklinkComponent {
  @Input() link: RouterLink['routerLink'] = '/';
  @Input() queryParams?: Params;
  @Input() studentId: number;
  @Input() studentName?: string;
  @Input() student?: Student;

  constructor() {}
}
