import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import {
  pluck,
  map,
  take,
  switchMap,
  finalize,
  shareReplay,
  filter,
  startWith,
} from 'rxjs/operators';

import { Person } from 'src/app/shared/models/person.model';
import { MyProfileService } from '../../services/my-profile.service';
import { PersonsRestService } from 'src/app/shared/services/persons-rest.service';
import { getControlValidationErrors } from 'src/app/shared/utils/form';

@Component({
  selector: 'erz-my-profile-edit',
  templateUrl: './my-profile-edit.component.html',
  styleUrls: ['./my-profile-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProfileEditComponent implements OnInit {
  student$ = this.profileService.profile$.pipe(pluck('student'));
  formGroup$ = this.student$.pipe(
    map(this.createFormGroup.bind(this)),
    shareReplay(1)
  );

  saving$ = new BehaviorSubject(false);
  private submitted$ = new BehaviorSubject(false);

  email2Errors$ = combineLatest([
    this.formGroup$.pipe(switchMap(getControlValidationErrors('email2'))),
    this.submitted$,
  ]).pipe(
    filter((v) => v[1]),
    map((v) => v[0]),
    startWith([]),
    shareReplay(1)
  );

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService,
    private profileService: MyProfileService,
    private personsService: PersonsRestService
  ) {}

  ngOnInit(): void {}

  cancel(): void {
    this.navigateBack();
  }

  onSubmit(): void {
    this.submitted$.next(true);
    this.formGroup$.pipe(take(1)).subscribe((formGroup) => {
      if (formGroup.valid) {
        const { phonePrivate, phoneMobile, email2 } = formGroup.value;
        this.save(
          phonePrivate?.trim() || null,
          phoneMobile?.trim() || null,
          email2 || null
        );
      }
    });
  }

  private createFormGroup(profile: Person): FormGroup {
    return this.fb.group({
      phonePrivate: [profile.PhonePrivate],
      phoneMobile: [profile.PhoneMobile],
      email2: [profile.Email2, Validators.email],
    });
  }

  private save(
    phonePrivate: Option<string>,
    phoneMobile: Option<string>,
    email2: Maybe<string>
  ): void {
    this.saving$.next(true);
    this.student$
      .pipe(
        take(1),
        switchMap((student) =>
          this.personsService.update(
            student.Id,
            phonePrivate,
            phoneMobile,
            email2
          )
        ),
        finalize(() => this.saving$.next(false))
      )
      .subscribe(this.onSaveSuccess.bind(this));
  }

  private onSaveSuccess(): void {
    this.profileService.reset(); // Ensure the profile will be reloaded
    this.toastr.success(this.translate.instant('my-profile.edit.save-success'));
    this.navigateBack();
  }

  private navigateBack(): void {
    this.router.navigate(['/my-profile']);
  }
}
