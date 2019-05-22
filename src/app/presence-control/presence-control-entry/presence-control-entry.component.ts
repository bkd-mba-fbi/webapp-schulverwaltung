import {
  Component,
  OnInit,
  Input,
  HostBinding,
  Output,
  EventEmitter
} from '@angular/core';
import { PresenceControlEntry } from '../models/presence-control-entry.model';

@Component({
  selector: 'erz-presence-control-entry',
  templateUrl: './presence-control-entry.component.html',
  styleUrls: ['./presence-control-entry.component.scss']
})
export class PresenceControlEntryComponent implements OnInit {
  @Input() entry: PresenceControlEntry;
  @Output() togglePresenceType = new EventEmitter<PresenceControlEntry>();

  @HostBinding('class') get presenceCategory(): string {
    return this.entry.presenceCategory;
  }

  constructor() {}

  ngOnInit(): void {}

  get presenceCategoryIcon(): string {
    switch (this.entry.presenceCategory) {
      case 'absent':
        return 'cancel';
      case 'late':
        return 'watch_later';
      default:
        return 'check_circle';
    }
  }
}
