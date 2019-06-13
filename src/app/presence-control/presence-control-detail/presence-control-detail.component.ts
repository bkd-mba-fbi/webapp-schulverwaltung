import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { PresenceControlDetailStateService } from './presence-control-detail-state-service';

@Component({
  selector: 'erz-presence-control-detail',
  templateUrl: './presence-control-detail.component.html',
  styleUrls: ['./presence-control-detail.component.scss']
})
export class PresenceControlDetailComponent implements OnInit {
  studentId$ = this.route.paramMap.pipe(
    map(params => Number(params.get('id')))
  );
  profile$ = this.studentId$.pipe(switchMap(id => this.state.getProfile(id)));

  constructor(
    private route: ActivatedRoute,
    public state: PresenceControlDetailStateService
  ) {}

  ngOnInit(): void {}
}
