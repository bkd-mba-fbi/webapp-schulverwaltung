import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SubscriptionDetail } from '../../../shared/models/subscription-detail.model';

interface GroupOptions {
  id: Option<string>;
  label: Option<string>;
}

@Component({
  selector: 'erz-presence-control-group-dialog',
  templateUrl: './presence-control-group-dialog.component.html',
  styleUrls: ['./presence-control-group-dialog.component.scss'],
})
export class PresenceControlGroupDialogComponent implements OnInit {
  @Input() title: string;
  @Input() emptyLabel: string;
  @Input() subscriptionDetail: SubscriptionDetail;
  groupOptions: Array<GroupOptions> = [];
  selected: GroupOptions;

  constructor(
    public activeModal: NgbActiveModal,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    const emptyOption = {
      id: null,
      label: this.translate.instant(this.emptyLabel),
    };
    this.groupOptions = this.createGroupOptions(this.subscriptionDetail);
    this.groupOptions.unshift(emptyOption);
    this.selected = emptyOption;
  }

  createGroupOptions(detail: SubscriptionDetail): Array<GroupOptions> {
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
