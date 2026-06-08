import {
  ChangeDetectionStrategy,
  Component,
  inject,
  linkedSignal,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormField, email, form, required } from "@angular/forms/signals";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { Observable, finalize, map, switchMap, take, throwError } from "rxjs";
import { FormErrorsComponent } from "src/app/shared/components/form-errors/form-errors.component";
import { SpinnerComponent } from "src/app/shared/components/spinner/spinner.component";
import { SubmitButtonComponent } from "src/app/shared/components/submit-button/submit-button.component";
import { PersonsRestService } from "src/app/shared/services/persons-rest.service";
import { ToastService } from "src/app/shared/services/toast.service";
import { MyProfileService } from "../../services/my-profile.service";

type InstructorEmailFormData = {
  instructorEmail: string;
};

@Component({
  selector: "bkd-my-profile-edit-instructor-email",
  imports: [
    FormField,
    TranslatePipe,
    SubmitButtonComponent,
    FormErrorsComponent,
    SpinnerComponent,
  ],
  templateUrl: "./my-profile-edit-instructor-email.component.html",
  styleUrl: "./my-profile-edit-instructor-email.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProfileEditInstructorEmailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private translate = inject(TranslateService);
  private toastService = inject(ToastService);
  private profileService = inject(MyProfileService);
  private personsService = inject(PersonsRestService);

  loading = toSignal(this.profileService.loadingPerson$, {
    requireSync: true,
  });
  submitted = signal(false);
  saving = signal(false);

  instructorEmail = toSignal(this.loadInstructorEmail(), {
    initialValue: null,
  });

  formData = linkedSignal<InstructorEmailFormData>(() => {
    return {
      instructorEmail: this.instructorEmail() ?? "",
    };
  });
  instructorEmailForm = form(this.formData, (schema) => {
    required(schema.instructorEmail);
    email(schema.instructorEmail);
  });

  onSubmit(event: Event): void {
    event.preventDefault();
    this.submitted.set(true);

    if (this.instructorEmailForm().invalid()) {
      return;
    }

    this.save(this.instructorEmailForm().value().instructorEmail);
  }

  cancel(): void {
    this.navigateBack();
  }

  private loadInstructorEmail(): Observable<Option<string>> {
    return this.profileService.person$.pipe(
      map((student) =>
        typeof student?.Custom1 === "string" ? student.Custom1 : null,
      ),
    );
  }

  private save(instructorEmail: string): void {
    this.saving.set(true);
    this.profileService.person$
      .pipe(
        take(1),
        map((person) => person?.Id ?? null),
        switchMap((personId) =>
          personId
            ? this.personsService.updateInstructorEmail(
                personId,
                instructorEmail,
              )
            : throwError(() => new Error("Person ID not available")),
        ),
        finalize(() => this.saving.set(false)),
      )
      .subscribe(() => {
        this.onSaveSuccess();
      });
  }

  private onSaveSuccess(): void {
    this.profileService.reloadStudent(); // Ensure the profile will be reloaded
    this.toastService.success(
      this.translate.instant("my-profile.edit-instructor-email.save-success"),
    );
    this.navigateBack();
  }

  private navigateBack(): void {
    const returnLink =
      this.route.snapshot.queryParams["returnlink"] || "/my-profile";

    void this.router.navigate([returnLink]);
  }
}
