import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { shareReplay, switchMap } from "rxjs";
import { AvatarService } from "../../services/avatar.service";

@Component({
  selector: "bkd-avatar-edit",
  imports: [],
  templateUrl: "./avatar-edit.component.html",
  styleUrl: "./avatar-edit.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[style.background-image]":
      "avatarDataUri() ? 'url(' + avatarDataUri() + ')' : null",
  },
})
export class AvatarEditComponent {
  private avatarService = inject(AvatarService);

  studentId = input.required<number>();
  avatarDataUri = toSignal(
    toObservable(this.studentId).pipe(
      switchMap((studentId) => this.avatarService.loadAvatarDataUri(studentId)),
      shareReplay(1),
    ),
  );
}
