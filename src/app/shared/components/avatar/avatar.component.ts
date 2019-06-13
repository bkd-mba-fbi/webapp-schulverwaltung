import { Component, Inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { SETTINGS, Settings } from 'src/app/settings';
import { StorageService } from '../../services/storage.service';

const FALLBACK_AVATAR = 'assets/images/avatar-placeholder.png';

@Component({
  selector: 'erz-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {
  @Input() studentId: number;
  @Input() link: string[];

  avatarStyles: Dict<string> = {};

  constructor(
    @Inject(SETTINGS) private settings: Settings,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.studentId) {
      this.avatarStyles = this.buildAvatarStyles(
        this.buildAvatarUrl(this.studentId)
      );
    }
  }

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
