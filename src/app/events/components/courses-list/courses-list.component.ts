import { Component } from '@angular/core';
import { CoursesStateService } from '../../services/courses-state.service';

@Component({
  selector: 'erz-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.scss'],
})
export class CoursesListComponent {
  constructor(public state: CoursesStateService) {}
}
