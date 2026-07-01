import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";

export type NotificationType = "success" | "error";

@Component({
  selector: "bkd-notification",
  imports: [],
  templateUrl: "./notification.component.html",
  styleUrl: "./notification.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent {
  readonly title = input<string>("");
  readonly message = input.required<string>();
  readonly type = input<NotificationType>("success");
  readonly actionLabel = input<string>("");
  readonly action = output<void>();

  handleClick(): void {
    this.action.emit();
  }
}
