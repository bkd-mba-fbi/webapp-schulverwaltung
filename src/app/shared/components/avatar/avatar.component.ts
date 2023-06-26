import {
  Component,
  Inject,
  Input,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { Params } from '@angular/router';

import { SETTINGS, Settings } from 'src/app/settings';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'erz-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnChanges {
  @Input() studentId: number;
  @Input() link: string[];
  @Input() linkParams?: Params;

  avatarStyles: Dict<string> = {};

  constructor(
    @Inject(SETTINGS) private settings: Settings,
    private storageService: StorageService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.studentId) {
      this.avatarStyles = this.buildAvatarStyles(this.studentId);
    }
  }

  private buildAvatarStyles(studentId: number): { [key: string]: string } {
    return {
      'background-image': [
        this.buildAvatarUrl(studentId),
        this.fallbackAvatarUrl,
      ]
        .map((url) => `url(${url})`)
        .join(', '),
    };
  }

  private buildAvatarUrl(studentId: number): string {
    const accessToken = this.storageService.getAccessToken() || '';
    return `${this.settings.apiUrl}/Files\/personPictures/${studentId}?token=${accessToken}`;
  }

  private get fallbackAvatarUrl(): string {
    return `${this.settings.scriptsAndAssetsPath}/assets/images/avatar-placeholder.png`;
  }
}
