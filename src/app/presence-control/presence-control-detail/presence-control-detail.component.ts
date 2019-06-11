import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { SETTINGS, Settings } from 'src/app/settings';
import { StorageService } from 'src/app/shared/services/storage.service';
import { PresenceControlDetailStateService } from './presence-control-detail-state-service';

const FALLBACK_AVATAR = 'assets/images/avatar-placeholder.png';

@Component({
  selector: 'erz-presence-control-detail',
  templateUrl: './presence-control-detail.component.html',
  styleUrls: ['./presence-control-detail.component.scss']
})
export class PresenceControlDetailComponent implements OnInit {
  private studentId$ = this.route.paramMap.pipe(
    map(params => Number(params.get('id')))
  );
  profile$ = this.studentId$.pipe(switchMap(id => this.state.getProfile(id)));

  private avatarUrl$ = this.studentId$.pipe(
    map(this.buildAvatarUrl.bind(this))
  );
  avatarStyles$ = this.avatarUrl$.pipe(map(this.buildAvatarStyles.bind(this)));

  constructor(
    @Inject(SETTINGS) private settings: Settings,
    private route: ActivatedRoute,
    public state: PresenceControlDetailStateService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {}

  // TODO duplicated code -> avatar component
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
