import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SubscriptionDetail } from '../../../shared/models/subscription-detail.model';
import { DropDownItem } from '../../../shared/models/drop-down-item.model';

export interface GroupOptions {
  id: Option<DropDownItem['Key']>;
  label: Option<string>;
}

export enum DialogMode {
  Select = 'select',
  Assign = 'assign',
}

@Component({
  selector: 'erz-presence-control-group-dialog',
  templateUrl: './presence-control-group-dialog.component.html',
  styleUrls: ['./presence-control-group-dialog.component.scss'],
})
export class PresenceControlGroupDialogComponent implements OnInit {
  @Input() dialogMode: DialogMode;
  @Input() subscriptionDetailsDefinitions: SubscriptionDetail;
  @Input() group: Option<string>;
  groupOptions: Array<GroupOptions> = [];
  selected: GroupOptions;
  title: string;

  constructor(
    public activeModal: NgbActiveModal,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.title = `presence-control.groups.${this.dialogMode}.title`;

    const emptyOption = this.createEmtpyOption();

    this.groupOptions = this.createGroupOptions(
      this.subscriptionDetailsDefinitions
    );
    this.groupOptions.unshift(emptyOption);

    this.selected =
      this.groupOptions.find((option) => option.id === this.group) ||
      emptyOption;
  }

  private createEmtpyOption(): GroupOptions {
    const emptyLabel =
      this.dialogMode === DialogMode.Select
        ? 'presence-control.groups.all'
        : 'presence-control.groups.none';

    return {
      id: null,
      label: this.translate.instant(emptyLabel),
    };
  }

  private createGroupOptions(detail: SubscriptionDetail): Array<GroupOptions> {
    return detail.DropdownItems
      ? detail.DropdownItems.map((item) => ({
          id: item.Key,
          label: `${this.translate.instant('presence-control.groups.group')} ${
            item.Value
          }`,
        }))
      : [];
  }

  getSelectedGroup(): Option<GroupOptions> {
    return this.selected;
  }

  onSelectionChange(option: GroupOptions): void {
    this.selected = option;
  }
}
