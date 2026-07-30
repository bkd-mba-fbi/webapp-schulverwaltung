import { AsyncPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
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
import { filter, finalize } from "rxjs/operators";
import { SubmitButtonComponent } from "src/app/shared/components/submit-button/submit-button.component";
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
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    TranslatePipe,
    SubmitButtonComponent,
  ],
})
export class MyProfileEditComponent {
  private readonly fb = inject(UntypedFormBuilder);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly translate = inject(TranslateService);
  private readonly profileService = inject(MyProfileService);
  private readonly personsService = inject(PersonsRestService);

  protected readonly person = toSignal(this.profileService.person$, {
    initialValue: null,
  });
  protected readonly formGroup = computed(() =>
    this.createFormGroup(this.person()),
  );
  private readonly formGroup$ = toObservable(this.formGroup).pipe(
    filter(notNull),
  );

  protected saving$ = new BehaviorSubject(false);
  private readonly submitted$ = new BehaviorSubject(false);

  protected formErrors$ = getValidationErrors(this.formGroup$, this.submitted$);
  protected email2Errors$ = getValidationErrors(
    this.formGroup$,
    this.submitted$,
    "email2",
  );

  protected cancel(): void {
    this.navigateBack();
  }

  protected onSubmit(): void {
    this.submitted$.next(true);
    const formGroup = this.formGroup();
    if (formGroup?.valid) {
      const { phonePrivate, phoneMobile, email2 } = formGroup.value;
      this.save(
        phonePrivate?.trim() || null,
        phoneMobile?.trim() || null,
        email2 || null,
      );
    }
  }

  private createFormGroup(person: Option<Person>): Option<UntypedFormGroup> {
    if (!person) return null;
    return this.fb.group({
      phonePrivate: [person.PhonePrivate],
      phoneMobile: [person.PhoneMobile],
      email2: [person.Email2, Validators.email],
    });
  }

  private save(
    phonePrivate: Option<string>,
    phoneMobile: Option<string>,
    email2: Maybe<string>,
  ): void {
    const person = this.person();
    if (!person) return;

    this.saving$.next(true);
    this.personsService
      .update(person.Id, phonePrivate, phoneMobile, email2)
      .pipe(finalize(() => this.saving$.next(false)))
      .subscribe(this.onSaveSuccess.bind(this));
  }

  private onSaveSuccess(): void {
    this.profileService.reloadStudent(); // Ensure the profile will be reloaded
    this.toastService.success(
      this.translate.instant("my-profile.edit.save-success"),
    );
    this.navigateBack();
  }

  private navigateBack(): void {
    void this.router.navigate(["/my-profile"]);
  }
}
