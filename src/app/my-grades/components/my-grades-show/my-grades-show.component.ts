import { Component } from '@angular/core';
import { MyGradesService } from '../../services/my-grades.service';

@Component({
  selector: 'erz-my-grades-show',
  templateUrl: './my-grades-show.component.html',
  styleUrls: ['./my-grades-show.component.scss'],
  providers: [MyGradesService],
})
export class MyGradesShowComponent {
  constructor(public myGradesService: MyGradesService) {}
}
