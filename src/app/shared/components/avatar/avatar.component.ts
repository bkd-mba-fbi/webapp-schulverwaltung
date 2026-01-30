import { NgStyle } from "@angular/common";
import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
} from "@angular/core";
import { Params, RouterLink } from "@angular/router";
import { AvatarService } from "../../services/avatar.service";

@Component({
  selector: "bkd-avatar",
  templateUrl: "./avatar.component.html",
  styleUrls: ["./avatar.component.scss"],
  imports: [RouterLink, NgStyle],
})
export class AvatarComponent implements OnChanges {
  private avatarService = inject(AvatarService);

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
        this.avatarService.getAvatarUrl(studentId),
        this.avatarService.getAvatarPlaceholderUrl(),
      ]
        .map((url) => `url(${url})`)
        .join(", "),
    };
  }
}
