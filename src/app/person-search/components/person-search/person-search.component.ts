import { Component } from '@angular/core';
import { StudentsRestService } from '../../../shared/services/students-rest.service';
import { DropDownItem } from '../../../shared/models/drop-down-item.model';
import { Router } from '@angular/router';

export interface StudentFilter {
  student: Option<number>;
}

@Component({
  selector: 'erz-search-person',
  templateUrl: './person-search.component.html',
  styleUrls: ['./person-search.component.scss'],
})
export class PersonSearchComponent {
  constructor(
    public studentsRestService: StudentsRestService,
    private router: Router
  ) {}

  filter: StudentFilter = {
    student: null,
  };

  navigateToDossier(key: DropDownItem['Key']) {
    console.log(key);
    const id = Number(key);
    this.router.navigate(['student', id]);
  }
}
