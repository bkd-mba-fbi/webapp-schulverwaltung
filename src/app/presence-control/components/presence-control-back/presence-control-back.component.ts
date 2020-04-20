import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Student } from 'src/app/shared/models/student.model';

@Component({
  selector: 'erz-presence-control-back',
  templateUrl: './presence-control-back.component.html',
  styleUrls: ['./presence-control-back.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresenceControlBackComponent implements OnInit {
  @Input() link: any[] | string = '/presence-control';
  @Input() studentId: number;
  @Input() studentName?: string;
  @Input() student?: Student;

  constructor() {}

  ngOnInit(): void {}
}
