import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

import { PresenceControlEntry } from '../../models/presence-control-entry.model';
import { ViewMode } from '../../services/presence-control-state.service';
import { Params } from '@angular/router';

@Component({
  selector: 'erz-presence-control-entry',
  templateUrl: './presence-control-entry.component.html',
  styleUrls: ['./presence-control-entry.component.scss'],
})
export class PresenceControlEntryComponent implements OnInit, OnChanges {
  @Input() entry: PresenceControlEntry;
  @Input() hasUnconfirmedAbsences = false;
  @Input() viewMode: ViewMode;
  @Input() profileReturnParams?: Params;

  @Output() togglePresenceType = new EventEmitter<PresenceControlEntry>();
  @Output() saveIncident = new EventEmitter<PresenceControlEntry>();

  @HostBinding('class') get classNames(): string {
    return [this.entry.presenceCategory, this.viewMode].join(' ');
  }

  private studentId$ = new ReplaySubject<number>(1);

  constructor(
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.entry) {
      this.studentId$.next(
        changes.entry.currentValue.lessonPresence.StudentRef.Id
      );
    }
  }

  get isListViewMode(): boolean {
    return this.viewMode === ViewMode.List;
  }

  updatePresenceType(entry: PresenceControlEntry): void {
    if (!entry.canChangePresenceType) {
      this.toastr.warning(
        this.translate.instant('presence-control.entry.update-warning')
      );
    } else {
      this.togglePresenceType.emit(entry);
    }
  }

  updateIncident(entry: PresenceControlEntry): void {
    if (!entry.canChangeIncident) {
      this.toastr.warning(
        this.translate.instant('presence-control.entry.update-warning')
      );
    } else {
      this.saveIncident.emit(entry);
    }
  }
}
