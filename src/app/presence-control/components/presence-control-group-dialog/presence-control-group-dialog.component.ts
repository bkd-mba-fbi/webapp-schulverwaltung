import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

interface GroupOptions {
  id: Option<number>;
  label: Option<string>;
}

@Component({
  selector: 'erz-presence-control-group-dialog',
  templateUrl: './presence-control-group-dialog.component.html',
  styleUrls: ['./presence-control-group-dialog.component.scss'],
})
export class PresenceControlGroupDialogComponent implements OnInit {
  title: string;
  emptyLabel: string;
  groupOptions: Array<GroupOptions> = [];
  selected: GroupOptions;

  constructor(
    public activeModal: NgbActiveModal,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    const emptyOption = this.createGroupOption(this.emptyLabel);
    this.groupOptions.unshift(emptyOption);
    this.selected = emptyOption;
  }

  createGroupOption(emptyLabel: string): GroupOptions {
    return {
      id: null,
      label: this.translate.instant(emptyLabel),
    };
  }

  getSelectedGroup(): void {
    console.log(this.selected);
  }
}
