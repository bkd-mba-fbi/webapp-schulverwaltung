import { Component } from '@angular/core';
import { CoursesStateService } from '../../services/courses-state.service';

@Component({
  selector: 'erz-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
  providers: [CoursesStateService],
})
export class CoursesComponent {
  constructor() {}
}
