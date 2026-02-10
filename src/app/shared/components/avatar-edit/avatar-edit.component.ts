import { HttpClient } from "@angular/common/http";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { Observable, shareReplay, switchMap } from "rxjs";
import { AvatarService } from "../../services/avatar.service";
import { convertBlobToDataUri } from "../../utils/blob";
import { catch404 } from "../../utils/observable";

@Component({
  selector: "bkd-avatar-edit",
  imports: [],
  templateUrl: "./avatar-edit.component.html",
  styleUrl: "./avatar-edit.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarEditComponent {
  private avatarService = inject(AvatarService);
  private http = inject(HttpClient);

  studentId = input.required<number>();
  avatarDataUri = toSignal(
    toObservable(this.studentId).pipe(
      switchMap((studentId) => this.loadAvatar(studentId)),
      shareReplay(1),
    ),
  );
  avatarPlaceholderUrl = this.avatarService.getAvatarPlaceholderUrl();

  private loadAvatar(studentId: number): Observable<Option<string>> {
    return this.http
      .get(this.avatarService.getAvatarUrl(studentId), { responseType: "blob" })
      .pipe(switchMap(convertBlobToDataUri), catch404(null));
  }
}
