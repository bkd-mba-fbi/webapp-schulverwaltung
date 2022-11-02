import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PresenceControlStateService } from '../../services/presence-control-state.service';
import { LessonPresencesUpdateService } from 'src/app/shared/services/lesson-presences-update.service';
import { CONFIRM_ABSENCES_SERVICE } from 'src/app/shared/tokens/confirm-absences-service';
import { PresenceControlGroupService } from '../../services/presence-control-group.service';
import { PresenceControlBlockLessonService } from '../../services/presence-control-block-lesson.service';

@Component({
  selector: 'erz-presence-control',
  template: '<router-outlet></router-outlet>',
  styleUrls: ['./presence-control.component.scss'],
  providers: [
    PresenceControlStateService,
    PresenceControlBlockLessonService,
    PresenceControlGroupService,
    {
      provide: CONFIRM_ABSENCES_SERVICE,
      useExisting: PresenceControlStateService,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresenceControlComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private state: PresenceControlStateService,
    private lessonPresencesUpdateService: LessonPresencesUpdateService
  ) {}

  ngOnInit(): void {
    // Wire-up the state and update services to reflect changes in the
    // currently loaded data
    this.lessonPresencesUpdateService.stateUpdates$
      .pipe(takeUntil(this.destroy$))
      .subscribe((updates) => this.state.updateLessonPresencesTypes(updates));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
