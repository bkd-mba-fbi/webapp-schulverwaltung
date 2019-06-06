import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { SETTINGS, Settings } from 'src/app/settings';
import { StorageService } from 'src/app/shared/services/storage.service';
import {
  PresenceControlDetailStateService,
  Profile
} from './presence-control-detail-state-service';

const FALLBACK_AVATAR = 'assets/images/avatar-placeholder.png';

@Component({
  selector: 'erz-presence-control-detail',
  templateUrl: './presence-control-detail.component.html',
  styleUrls: ['./presence-control-detail.component.scss']
})
export class PresenceControlDetailComponent implements OnInit {
  profile$: Observable<Profile>;
  private studentId: number;
  private studentIdSubject$ = new ReplaySubject<number>(1);
  private avatarUrl$ = this.studentIdSubject$.pipe(
    map(this.buildAvatarUrl.bind(this))
  );

  constructor(
    @Inject(SETTINGS) private settings: Settings,
    private route: ActivatedRoute,
    private router: Router,
    public state: PresenceControlDetailStateService,
    private storageService: StorageService
  ) {}

  avatarStyles$ = this.avatarUrl$.pipe(map(this.buildAvatarStyles.bind(this)));

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.studentId = Number(params.get('id'));
    });

    this.profile$ = this.state.getProfile(this.studentId);
    this.studentIdSubject$.next(this.studentId);
  }

  goToList(): void {
    this.router.navigate(['/presence-control']);
  }

  // TODO duplicated code
  private buildAvatarUrl(studentId: number): string {
    const accessToken = this.storageService.getAccessToken() || '';
    return `${
      this.settings.apiUrl
    }/Files\/personPictures/${studentId}?token=${accessToken}`;
  }

  private buildAvatarStyles(url: string): { [key: string]: string } {
    return {
      'background-image': `url(${url}), url(${FALLBACK_AVATAR})`
    };
  }
}
