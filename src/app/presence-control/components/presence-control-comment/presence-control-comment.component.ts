import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import {
  catchError,
  finalize,
  map,
  pluck,
  shareReplay,
  startWith,
  switchMap,
  take,
  tap
} from 'rxjs/operators';
import { withConfig } from 'src/app/rest-error-interceptor';
import { LessonPresencesUpdateRestService } from 'src/app/shared/services/lesson-presences-update-rest.service';
import { StudentsRestService } from 'src/app/shared/services/students-rest.service';
import { validatationErrorsToArray } from 'src/app/shared/utils/form';
import { PresenceControlEntry } from '../../models/presence-control-entry.model';
import { PresenceControlStateService } from '../../services/presence-control-state.service';

@Component({
  selector: 'erz-presence-control-comment',
  templateUrl: './presence-control-comment.component.html',
  styleUrls: ['./presence-control-comment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PresenceControlCommentComponent implements OnInit {
  @ViewChild('commentField', { static: false }) commentField?: ElementRef;

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
    private studentsService: StudentsRestService,
    private lessonPresencesRestService: LessonPresencesUpdateRestService
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
    return this.lessonPresencesRestService
      .editLessonPresences(
        [entry.lessonPresence.LessonRef.Id],
        [entry.lessonPresence.StudentRef.Id],
        undefined,
        undefined,
        newComment ? newComment : null,
        withConfig({ disableErrorHandling: true })
      )
      .pipe(finalize(() => this.saving$.next(false)));
  }

  private onSaveError(error: any): Observable<void> {
    console.error('Error while saving comment:', error);
    this.toastr.error(
      this.translate.instant('presence-control.comment.save-error')
    );
    return of(undefined);
  }
}
