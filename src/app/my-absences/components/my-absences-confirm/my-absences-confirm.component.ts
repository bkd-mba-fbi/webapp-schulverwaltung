import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import {
  take,
  switchMap,
  finalize,
  map,
  filter,
  startWith,
} from 'rxjs/operators';

import { ConfirmAbsencesSelectionService } from 'src/app/shared/services/confirm-absences-selection.service';
import { LessonPresencesUpdateRestService } from 'src/app/shared/services/lesson-presences-update-rest.service';
import { PresenceTypesService } from 'src/app/shared/services/presence-types.service';
import { getValidationErrors } from 'src/app/shared/utils/form';
import { SETTINGS, Settings } from 'src/app/settings';
import { MyAbsencesService } from '../../services/my-absences.service';

@Component({
  selector: 'erz-my-absences-confirm',
  templateUrl: './my-absences-confirm.component.html',
  styleUrls: ['./my-absences-confirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyAbsencesConfirmComponent implements OnInit {
  formGroup = this.createFormGroup();

  saving$ = new BehaviorSubject(false);
  private submitted$ = new BehaviorSubject(false);

  absenceTypes$ = this.presenceTypesService.confirmationTypes$.pipe(
    map((types) => types.filter((t) => t.IsAbsence && !t.IsHalfDay))
  );

  absenceTypeIdErrors$ = combineLatest([
    getValidationErrors(this.formGroup.get('absenceTypeId')),
    this.submitted$,
  ]).pipe(
    filter((v) => v[1]),
    map((v) => v[0]),
    startWith([])
  );

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService,
    private presenceTypesService: PresenceTypesService,
    private updateService: LessonPresencesUpdateRestService,
    private myAbsencesService: MyAbsencesService,
    @Inject(SETTINGS) private settings: Settings,
    public selectionService: ConfirmAbsencesSelectionService
  ) {}

  ngOnInit(): void {
    this.selectionService.selectedIds$
      .pipe(take(1))
      .subscribe((selectedIds) => {
        if (selectedIds.length === 0) {
          // Nothing to confirm if no entries are selected
          this.navigateBack();
        }
      });
  }

  onSubmit(): void {
    this.submitted$.next(true);
    if (this.formGroup.valid) {
      const { absenceTypeId } = this.formGroup.value;
      this.save(absenceTypeId);
    }
  }

  cancel(): void {
    this.navigateBack();
  }

  private createFormGroup(): FormGroup {
    return this.fb.group({
      absenceTypeId: [null, Validators.required],
    });
  }

  private save(absenceTypeId: number): void {
    this.saving$.next(true);

    this.selectionService.selectedIds$
      .pipe(
        take(1),
        switchMap((selectedIds) =>
          combineLatest(
            selectedIds.map(({ lessonIds, personIds }) =>
              this.updateService.editLessonPresences(
                lessonIds,
                personIds,
                absenceTypeId,
                this.settings.unconfirmedAbsenceStateId
              )
            )
          )
        ),
        finalize(() => this.saving$.next(false))
      )
      .subscribe(this.onSaveSuccess.bind(this));
  }

  private onSaveSuccess(): void {
    this.myAbsencesService.reset();
    this.toastr.success(
      this.translate.instant('my-absences.confirm.save-success')
    );
    this.navigateBack();
  }

  private navigateBack(): void {
    this.router.navigate(['/my-absences']);
  }
}
