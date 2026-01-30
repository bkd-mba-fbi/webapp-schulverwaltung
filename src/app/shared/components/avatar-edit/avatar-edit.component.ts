import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { TranslatePipe } from "@ngx-translate/core";
import { Subject, map, merge, shareReplay, switchMap } from "rxjs";
import { AvatarService } from "../../services/avatar.service";
import { BkdModalService } from "../../services/bkd-modal.service";
import { AvatarEditDialogComponent } from "../avatar-edit-dialog/avatar-edit-dialog.component";

@Component({
  selector: "bkd-avatar-edit",
  imports: [TranslatePipe],
  templateUrl: "./avatar-edit.component.html",
  styleUrl: "./avatar-edit.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[style.background-image]":
      "avatarDataUri() ? 'url(' + avatarDataUri() + ')' : null",
    "[class.edit]": "!avatarDataUri()",
    "(click)": "openDialog()",
  },
})
export class AvatarEditComponent {
  private avatarService = inject(AvatarService);
  private modalService = inject(BkdModalService);
  private reload$ = new Subject<void>();

  studentId = input.required<number>();
  avatarDataUri = toSignal(
    merge(
      toObservable(this.studentId),
      this.reload$.pipe(map(() => this.studentId())),
    ).pipe(
      switchMap((studentId) => this.avatarService.loadAvatarDataUri(studentId)),
      shareReplay(1),
    ),
  );

  openDialog(event?: Event) {
    event?.stopImmediatePropagation();
    if (this.avatarDataUri()) {
      // Cannot change image, once it is set
      return;
    }

    const modalRef = this.modalService.open(AvatarEditDialogComponent);

    const component = modalRef.componentInstance as AvatarEditDialogComponent;
    component.studentId.set(this.studentId());

    modalRef.closed.subscribe(() => {
      this.reload$.next();
    });
  }
}
