import {
  Component,
  computed,
  inject,
  input,
  linkedSignal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { DropDownItem } from "../../../shared/models/drop-down-item.model";
import { SubscriptionDetail } from "../../../shared/models/subscription.model";

export interface GroupOption {
  id: Option<DropDownItem["Key"]>;
  label: Option<string>;
}

export enum DialogMode {
  Select = "select",
  Assign = "assign",
}

@Component({
  selector: "bkd-presence-control-group-dialog",
  templateUrl: "./presence-control-group-dialog.component.html",
  imports: [FormsModule, TranslatePipe],
})
export class PresenceControlGroupDialogComponent {
  activeModal = inject(NgbActiveModal);
  private translate = inject(TranslateService);

  readonly dialogMode = input.required<DialogMode>();
  readonly subscriptionDetailsDefinitions =
    input.required<SubscriptionDetail>();
  readonly group = input<Option<string>>(null);

  title = computed(() => `presence-control.groups.${this.dialogMode()}.title`);
  groupOptions = computed(() => [
    this.createEmptyOption(),
    ...this.createGroupOptions(this.subscriptionDetailsDefinitions()),
  ]);
  selected = linkedSignal(
    () =>
      this.groupOptions().find((option) => option.id === this.group()) ??
      this.createEmptyOption(),
  );

  private createEmptyOption(): GroupOption {
    const emptyLabel =
      this.dialogMode() === DialogMode.Select
        ? "presence-control.groups.all"
        : "presence-control.groups.none";

    return {
      id: null,
      label: this.translate.instant(emptyLabel),
    };
  }

  private createGroupOptions(detail: SubscriptionDetail): Array<GroupOption> {
    return detail.DropdownItems
      ? detail.DropdownItems.map((item) => ({
          id: item.Key,
          label: `${this.translate.instant("presence-control.groups.group")} ${
            item.Value
          }`,
        }))
      : [];
  }
}
