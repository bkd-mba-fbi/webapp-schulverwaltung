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

  person = toSignal(this.profileService.person$, { initialValue: null });
  formGroup = computed(() => this.createFormGroup(this.person()));
  formGroup$ = toObservable(this.formGroup).pipe(filter(notNull));

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
