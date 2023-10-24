import { Component } from '@angular/core';
import { StudentsRestService } from '../../../shared/services/students-rest.service';
import { Router } from '@angular/router';
import { DropDownItem } from '../../../shared/models/drop-down-item.model';

export interface StudentFilter {
  student: Option<number>;
}

@Component({
  selector: 'erz-person-search-header',
  templateUrl: './person-search-header.component.html',
  styleUrls: ['./person-search-header.component.scss'],
})
export class PersonSearchHeaderComponent {
  constructor(
    public studentsRestService: StudentsRestService,
    private router: Router,
  ) {}

  filter: StudentFilter = {
    student: null,
  };

  navigateToDossier(key: DropDownItem['Key']) {
    const id = Number(key);
    this.router.navigate(['person-search', 'student', id, 'addresses']);
  }
}
