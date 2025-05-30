import { NgStyle } from "@angular/common";
import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
} from "@angular/core";
import { Params, RouterLink } from "@angular/router";
import { SETTINGS, Settings } from "src/app/settings";
import { StorageService } from "../../services/storage.service";

@Component({
  selector: "bkd-avatar",
  templateUrl: "./avatar.component.html",
  styleUrls: ["./avatar.component.scss"],
  imports: [RouterLink, NgStyle],
})
export class AvatarComponent implements OnChanges {
  private settings = inject<Settings>(SETTINGS);
  private storageService = inject(StorageService);

  @Input() studentId: number;
  @Input() link: RouterLink["routerLink"];
  @Input() linkParams?: Params;

  avatarStyles: Dict<string> = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["studentId"]) {
      this.avatarStyles = this.buildAvatarStyles(this.studentId);
    }
  }

  private buildAvatarStyles(studentId: number): { [key: string]: string } {
    return {
      "background-image": [
        this.buildAvatarUrl(studentId),
        this.fallbackAvatarUrl,
      ]
        .map((url) => `url(${url})`)
        .join(", "),
    };
  }

  private buildAvatarUrl(studentId: number): string {
    const accessToken = this.storageService.getAccessToken() || "";
    return `${this.settings.apiUrl}/Files/personPictures/${studentId}?token=${accessToken}`;
  }

  private get fallbackAvatarUrl(): string {
    return `${this.settings.scriptsAndAssetsPath}/assets/images/avatar-placeholder.png`;
  }
}
