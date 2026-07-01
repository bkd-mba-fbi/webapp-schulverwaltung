import { NgStyle } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from "@angular/core";
import { Params, RouterLink } from "@angular/router";
import { AvatarService } from "../../services/avatar.service";

@Component({
  selector: "bkd-avatar",
  templateUrl: "./avatar.component.html",
  styleUrls: ["./avatar.component.scss"],
  imports: [RouterLink, NgStyle],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
  private avatarService = inject(AvatarService);

  readonly studentId = input.required<number>();
  readonly link = input<RouterLink["routerLink"]>();
  readonly linkParams = input<Params>();

  avatarStyles = computed<Dict<string>>(() =>
    this.buildAvatarStyles(this.studentId()),
  );

  private buildAvatarStyles(studentId: number): { [key: string]: string } {
    return {
      "background-image": [
        this.avatarService.getAvatarUrl(studentId),
        this.avatarService.getAvatarPlaceholderUrl(),
      ]
        .map((url) => `url(${url})`)
        .join(", "),
    };
  }
}
