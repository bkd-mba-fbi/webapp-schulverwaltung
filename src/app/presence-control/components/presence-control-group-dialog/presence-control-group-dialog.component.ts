import { Component, Input, OnInit, inject } from "@angular/core";
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
export class PresenceControlGroupDialogComponent implements OnInit {
  activeModal = inject(NgbActiveModal);
  private translate = inject(TranslateService);

  @Input() dialogMode: DialogMode;
  @Input() subscriptionDetailsDefinitions: SubscriptionDetail;
  @Input() group: Option<string>;
  groupOptions: Array<GroupOption> = [];
  selected: GroupOption;
  title: string;

  ngOnInit(): void {
    this.title = `presence-control.groups.${this.dialogMode}.title`;

    const emptyOption = this.createEmtpyOption();

    this.groupOptions = this.createGroupOptions(
      this.subscriptionDetailsDefinitions,
    );
    this.groupOptions.unshift(emptyOption);

    this.selected =
      this.groupOptions.find((option) => option.id === this.group) ||
      emptyOption;
  }

  private createEmtpyOption(): GroupOption {
    const emptyLabel =
      this.dialogMode === DialogMode.Select
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

  getSelectedGroup(): Option<GroupOption> {
    return this.selected;
  }

  onSelectionChange(option: GroupOption): void {
    this.selected = option;
  }
}
