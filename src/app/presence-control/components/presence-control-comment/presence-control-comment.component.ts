import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, of, combineLatest } from 'rxjs';
import {
  map,
  pluck,
  shareReplay,
  switchMap,
  take,
  startWith,
  catchError,
  finalize,
  tap,
  delay
} from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

import { PresenceControlStateService } from '../../services/presence-control-state.service';
import { StudentsRestService } from 'src/app/shared/services/students-rest.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import { PresenceControlEntry } from '../../models/presence-control-entry.model';
import { validatationErrorsToArray } from 'src/app/shared/utils/form';

@Component({
  selector: 'erz-presence-control-comment',
  templateUrl: './presence-control-comment.component.html',
  styleUrls: ['./presence-control-comment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PresenceControlCommentComponent implements OnInit {
  @ViewChild('commentField') commentField?: ElementRef;

  private params$ = this.route.paramMap.pipe(
    map(params => ({
      studentId: Number(params.get('studentId')),
      lessonId: Number(params.get('lessonId'))
    }))
  );

  editing$ = new BehaviorSubject(false);
  saving$ = new BehaviorSubject(false);

  studentId$ = this.params$.pipe(pluck('studentId'));
  student$ = this.studentId$.pipe(
    switchMap(id => this.studentsService.get(id)),
    shareReplay(1)
  );

  presenceControlEntry$ = this.params$.pipe(
    switchMap(({ studentId, lessonId }) =>
      this.state.getPresenceControlEntry(studentId, lessonId)
    )
  );

  formGroup$ = this.presenceControlEntry$.pipe(
    map(this.createFormGroup.bind(this)),
    startWith(this.createFormGroup()),
    shareReplay(1)
  );

  commentErrors$ = this.formGroup$.pipe(
    switchMap(this.getCommentErrors.bind(this)),
    startWith([]),
    shareReplay(1)
  );

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private translate: TranslateService,
    private state: PresenceControlStateService,
    private studentsService: StudentsRestService
  ) {}

  ngOnInit(): void {
    // Disable comment field during saving
    combineLatest(this.formGroup$, this.saving$).subscribe(
      ([formGroup, saving]) => {
        const control = formGroup.get('comment');
        if (control) {
          saving ? control.disable() : control.enable();
        }
      }
    );
  }

  onCommentIconClick(): void {
    this.editing$
      .pipe(take(1))
      .subscribe(editing =>
        editing ? this.focusCommentField() : this.startEditing()
      );
  }

  startEditing(): void {
    this.editing$.next(true);
    setTimeout(this.focusCommentField.bind(this));
  }

  stopEditing(): void {
    this.editing$.next(false);
  }

  cancel(): void {
    this.stopEditing();
  }

  onSubmit(): void {
    combineLatest(
      this.formGroup$.pipe(take(1)),
      this.presenceControlEntry$.pipe(take(1))
    )
      .pipe(
        switchMap(([formGroup, entry]) => {
          if (formGroup.valid && entry) {
            const comment = formGroup.value.comment;
            return this.saveComment(entry, comment).pipe(
              tap(() => {
                this.state.updateLessonPresenceComment(
                  entry.lessonPresence,
                  comment
                );
                this.stopEditing();
              })
            );
          }
          return of(null);
        }),
        catchError(error => this.onSaveError(error))
      )
      .subscribe();
  }

  private createFormGroup(
    entry: Option<PresenceControlEntry> = null
  ): FormGroup {
    return this.fb.group({
      comment: [
        entry ? entry.lessonPresence.PresenceComment || '' : '',
        Validators.maxLength(255)
      ]
    });
  }

  private getCommentErrors(
    formGroup: FormGroup
  ): Observable<ReadonlyArray<{ error: string; params: any }>> {
    const control = formGroup.get('comment') as FormControl;
    return control.statusChanges.pipe(
      startWith(control.status),
      map(() => validatationErrorsToArray(control))
    );
  }

  private focusCommentField(): void {
    if (this.commentField) {
      this.commentField.nativeElement.focus();
    }
  }

  private saveComment(
    entry: PresenceControlEntry,
    newComment: string
  ): Observable<any> {
    this.saving$.next(true);
    // TODO: Implement saving of comment
    console.log(`Save comment "${newComment}" for entry`, entry);
    return of(undefined).pipe(
      delay(2000), // TODO: Remove, just for simulating request time
      finalize(() => this.saving$.next(false))
    );
  }

  private onSaveError(error: any): Observable<void> {
    console.error('Error while saving comment:', error);
    this.toastr.error(
      this.translate.instant('presence-control.comment.save-error')
    );
    return of(undefined);
  }
}
