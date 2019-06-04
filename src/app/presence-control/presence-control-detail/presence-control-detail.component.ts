import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  PresenceControlDetailStateService,
  Profile
} from './presence-control-detail-state-service';

@Component({
  selector: 'erz-presence-control-detail',
  templateUrl: './presence-control-detail.component.html',
  styleUrls: ['./presence-control-detail.component.scss']
})
export class PresenceControlDetailComponent implements OnInit {
  profile$: Observable<Profile>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public state: PresenceControlDetailStateService
  ) {}

  ngOnInit(): void {
    this.profile$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.state.getProfile(Number(params.get('id')))
      )
    );
  }

  goToList(): void {
    this.router.navigate(['/presence-control']);
  }
}
