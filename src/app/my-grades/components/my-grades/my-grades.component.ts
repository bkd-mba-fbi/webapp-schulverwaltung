import { Component } from '@angular/core';
import { MyGradesService } from '../../services/my-grades.service';

@Component({
  selector: 'erz-my-grades',
  templateUrl: './my-grades.component.html',
  styleUrls: ['./my-grades.component.scss'],
  providers: [MyGradesService],
})
export class MyGradesComponent {
  constructor() {}
}
