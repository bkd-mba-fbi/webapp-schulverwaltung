import { NgStyle } from "@angular/common";
import { Component, computed, inject, input } from "@angular/core";
import { Params, RouterLink } from "@angular/router";
import { AvatarService } from "../../services/avatar.service";

@Component({
  selector: "bkd-avatar",
  templateUrl: "./avatar.component.html",
  styleUrls: ["./avatar.component.scss"],
  imports: [RouterLink, NgStyle],
})
export class AvatarComponent {
  private avatarService = inject(AvatarService);

  studentId = input.required<number>();
  link = input<RouterLink["routerLink"]>();
  linkParams = input<Params | undefined>();

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
