import { Component } from '@angular/core';
import { StudentsRestService } from '../../../shared/services/students-rest.service';

export interface StudentFilter {
  student: Option<number>;
}

@Component({
  selector: 'erz-search-person',
  templateUrl: './person-search.component.html',
  styleUrls: ['./person-search.component.scss'],
})
export class PersonSearchComponent {
  constructor(public studentsRestService: StudentsRestService) {}

  filter: StudentFilter = {
    student: null,
  };
}
