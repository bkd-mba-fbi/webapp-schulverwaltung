import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

import { EditAbsencesStateService } from '../../services/edit-absences-state.service';
import { EditAbsencesSelectionService } from '../../services/edit-absences-selection.service';
import { ScrollPositionService } from 'src/app/shared/services/scroll-position.service';

@Component({
  selector: 'erz-edit-absences-list',
  templateUrl: './edit-absences-list.component.html',
  styleUrls: ['./edit-absences-list.component.scss'],
  providers: [EditAbsencesSelectionService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditAbsencesListComponent
  implements OnInit, AfterViewInit, OnDestroy {
  private destroy$ = new Subject();

  constructor(
    public state: EditAbsencesStateService,
    public selectionService: EditAbsencesSelectionService,
    private scrollPosition: ScrollPositionService
  ) {}

  ngOnInit(): void {
    // Clear selection when new entries have been loaded
    this.state.lessonPresences$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.selectionService.clear());

    // Remember selected entries
    this.selectionService.selectedIds$
      .pipe(takeUntil(this.destroy$))
      .subscribe(ids => (this.state.selected = ids));
  }

  ngAfterViewInit(): void {
    this.scrollPosition.restore();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  toggleAll(checked: boolean): void {
    this.state.lessonPresences$
      .pipe(take(1))
      .subscribe(entries =>
        this.selectionService.clear(checked ? entries : null)
      );
  }

  onCheckboxCellClick(event: Event, checkbox: HTMLInputElement): void {
    if (event.target !== checkbox) {
      checkbox.click();
    }
  }
}
