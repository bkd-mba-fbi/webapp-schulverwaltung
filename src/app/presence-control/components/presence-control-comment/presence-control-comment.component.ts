import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  map,
  pluck,
  shareReplay,
  switchMap,
  take,
  startWith
} from 'rxjs/operators';

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
    private state: PresenceControlStateService,
    private studentsService: StudentsRestService
  ) {}

  ngOnInit(): void {}

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
    // TODO: Display dialog for unsaved comment, as well when clicking
    // on the back link
    this.stopEditing();
  }

  onSubmit(): void {
    this.formGroup$.pipe(take(1)).subscribe(formGroup => {
      if (formGroup.valid) {
        const comment = formGroup.value.comment;

        console.log('save comment', comment);
        // TODO: Save comment and update state

        this.stopEditing();
      }
    });
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
}
