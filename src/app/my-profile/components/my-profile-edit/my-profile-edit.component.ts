import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { BehaviorSubject } from "rxjs";
import {
  filter,
  finalize,
  map,
  shareReplay,
  switchMap,
  take,
} from "rxjs/operators";
import { Person } from "src/app/shared/models/person.model";
import { PersonsRestService } from "src/app/shared/services/persons-rest.service";
import { getValidationErrors } from "src/app/shared/utils/form";
import { ToastService } from "../../../shared/services/toast.service";
import { notNull } from "../../../shared/utils/filter";
import { MyProfileService } from "../../services/my-profile.service";

@Component({
  selector: "bkd-my-profile-edit",
  templateUrl: "./my-profile-edit.component.html",
  styleUrls: ["./my-profile-edit.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ReactiveFormsModule, AsyncPipe, TranslatePipe],
})
export class MyProfileEditComponent {
  private fb = inject(UntypedFormBuilder);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private translate = inject(TranslateService);
  private profileService = inject(MyProfileService);
  private personsService = inject(PersonsRestService);

  student$ = this.profileService.profile$.pipe(
    filter(notNull),
    map(({ student }) => student),
  );
  formGroup$ = this.student$.pipe(
    map(this.createFormGroup.bind(this)),
    shareReplay(1),
  );

  saving$ = new BehaviorSubject(false);
  private submitted$ = new BehaviorSubject(false);

  formErrors$ = getValidationErrors(this.formGroup$, this.submitted$);
  email2Errors$ = getValidationErrors(
    this.formGroup$,
    this.submitted$,
    "email2",
  );

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
          email2 || null,
        );
      }
    });
  }

  private createFormGroup(profile: Person): UntypedFormGroup {
    return this.fb.group({
      phonePrivate: [profile.PhonePrivate],
      phoneMobile: [profile.PhoneMobile],
      email2: [profile.Email2, Validators.email],
    });
  }

  private save(
    phonePrivate: Option<string>,
    phoneMobile: Option<string>,
    email2: Maybe<string>,
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
            email2,
          ),
        ),
        finalize(() => this.saving$.next(false)),
      )
      .subscribe(this.onSaveSuccess.bind(this));
  }

  private onSaveSuccess(): void {
    this.profileService.reset(); // Ensure the profile will be reloaded
    this.toastService.success(
      this.translate.instant("my-profile.edit.save-success"),
    );
    this.navigateBack();
  }

  private navigateBack(): void {
    void this.router.navigate(["/my-profile"]);
  }
}
