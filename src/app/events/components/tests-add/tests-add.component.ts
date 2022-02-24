import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { Course } from 'src/app/shared/models/course.model';
import { TestStateService } from '../../services/test-state.service';

@Component({
  selector: 'erz-tests-add',
  templateUrl: './tests-add.component.html',
  styleUrls: ['./tests-add.component.scss'],
})
export class TestsAddComponent implements OnInit {
  course$: Observable<Course>;

  constructor(public state: TestStateService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.course$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const id = Number(params.get('id'));
        return this.state.getCourse(id);
      })
    );
  }
}
