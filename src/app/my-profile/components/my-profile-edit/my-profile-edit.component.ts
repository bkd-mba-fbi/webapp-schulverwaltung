import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
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
import { LetDirective } from "../../../shared/directives/let.directive";
import { ToastService } from "../../../shared/services/toast.service";
import { notNull } from "../../../shared/utils/filter";
import { MyProfileService } from "../../services/my-profile.service";

@Component({
  selector: "erz-my-profile-edit",
  templateUrl: "./my-profile-edit.component.html",
  styleUrls: ["./my-profile-edit.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    LetDirective,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    NgFor,
    AsyncPipe,
    TranslateModule,
  ],
})
export class MyProfileEditComponent {
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

  email2Errors$ = getValidationErrors(
    this.formGroup$,
    this.submitted$,
    "email2",
  );

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private toastService: ToastService,
    private translate: TranslateService,
    private profileService: MyProfileService,
    private personsService: PersonsRestService,
  ) {}

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
    this.router.navigate(["/my-profile"]);
  }
}
