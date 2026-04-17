import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormField, form, required } from "@angular/forms/signals";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { SETTINGS, Settings } from "src/app/settings";
import { AdditionalInformation } from "src/app/shared/models/additional-informations.model";
import { DropDownItem } from "src/app/shared/models/drop-down-item.model";
import { StudentDossierEditService } from "src/app/shared/services/student-dossier-edit.service";
import { ToastService } from "src/app/shared/services/toast.service";
import { fileType } from "src/app/shared/validators/file-type.validator";
import { maxFileSize } from "src/app/shared/validators/max-file-size.validator";
import { BacklinkComponent } from "../../backlink/backlink.component";
import { ButtonGroupComponent } from "../../button-group/button-group.component";
import { FileInputComponent } from "../../file-input/file-input.component";
import { FormErrorsComponent } from "../../form-errors/form-errors.component";
import { SelectComponent } from "../../select/select.component";
import { SpinnerComponent } from "../../spinner/spinner.component";
import { SubmitButtonComponent } from "../../submit-button/submit-button.component";

type DossierEntryFormData = {
  type: "document" | "note";
  file: Option<File>;
  designation: string;
  description: string;
  category: Option<DropDownItem["Key"]>;
  forTeacher: "class-teacher-only" | "all";
  forStudent: boolean;
};

const CLASS_TEACHER_OBJECT_TYPE_ID = 2;
const ALL_TEACHERS_OBJECT_TYPE_ID = 3;

@Component({
  selector: "bkd-student-dossier-edit",
  imports: [
    RouterLink,
    FormField,
    TranslatePipe,
    BacklinkComponent,
    SpinnerComponent,
    ButtonGroupComponent,
    FileInputComponent,
    SelectComponent,
    FormErrorsComponent,
    SubmitButtonComponent,
  ],
  providers: [StudentDossierEditService],
  templateUrl: "./student-dossier-edit.component.html",
  styleUrl: "./student-dossier-edit.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentDossierEditComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private translate = inject(TranslateService);
  private editService = inject(StudentDossierEditService);
  private toastService = inject(ToastService);
  private settings = inject<Settings>(SETTINGS);

  acceptedFileTypes = this.settings.dossierAllowedFileTypes;

  loading = toSignal(this.editService.loading$, { requireSync: true });
  saving = signal(false);
  studentId = toSignal(this.editService.studentId$, {
    requireSync: true,
  });
  studentName = toSignal(this.editService.studentName$, { initialValue: null });
  additionalInformationId = toSignal(
    this.editService.additionalInformationId$,
    {
      requireSync: true,
    },
  );
  additionalInformation = toSignal(this.editService.additionalInformation$, {
    initialValue: null,
  });
  categories = toSignal(this.editService.categories$, {
    initialValue: [],
  });

  heading = computed(() =>
    this.additionalInformationId()
      ? this.translate.instant("student.dossier.edit.title-update", {
          designation: this.additionalInformation()?.Designation,
        })
      : this.translate.instant("student.dossier.edit.title-new"),
  );

  types = ["document", "note"].map((key) => ({
    key,
    label: this.translate.instant(`student.dossier.edit.type.${key}`),
  }));

  entryFormData = signal<DossierEntryFormData>({
    type: "document",
    file: null,
    designation: "",
    description: "",
    category: null,
    forTeacher: "class-teacher-only",
    forStudent: true,
  });
  entryForm = form(this.entryFormData, (schema) => {
    const isDocument = () => this.entryFormData().type === "document";
    required(schema.type);
    required(schema.file, {
      when: isDocument,
    });
    maxFileSize(schema.file, {
      maxBytes: this.settings.dossierMaxFileSize,
      when: isDocument,
    });
    fileType(schema.file, {
      acceptedFileTypes: this.acceptedFileTypes,
      when: isDocument,
    });
    required(schema.designation);
    required(schema.category);
    required(schema.forTeacher);
  });

  submitted = signal(false);

  async onSubmit(event: Event) {
    event.preventDefault();
    this.submitted.set(true);

    if (this.entryForm().invalid()) {
      return;
    }

    this.saving.set(true);
    try {
      const entry = await this.buildEntry(
        this.studentId(),
        this.entryFormData(),
      );
      const { type, file } = this.entryForm().value();
      const success = await this.saveEntry(type, entry, file);
      if (success) {
        this.toastService.success(
          this.translate.instant("student.dossier.edit.save-success"),
        );
        await this.navigateBack();
      } else {
        this.toastService.error(
          this.translate.instant("student.dossier.edit.save-error"),
        );
      }
    } finally {
      this.saving.set(false);
    }
  }

  private async buildEntry(
    studentId: Option<number>,
    formData: DossierEntryFormData,
  ): Promise<Partial<AdditionalInformation>> {
    const { designation, description, category, forTeacher, forStudent } =
      formData;

    return {
      ObjectId: await this.getObjectId(studentId, forTeacher),
      ObjectTypeId:
        forTeacher === "class-teacher-only"
          ? CLASS_TEACHER_OBJECT_TYPE_ID
          : ALL_TEACHERS_OBJECT_TYPE_ID,
      TypeId: this.settings.dossierCreateTypeId,
      CodeId: category == null ? null : Number(category),
      Designation: designation?.trim(),
      Description: description?.trim() || null,
      ForStudent: forStudent,
    };
  }

  /**
   * If visible for all teachers of the class (incl. "Fachlehrpersonen"), the
   * entry is attached to the person. If visible only to the class teacher, the
   * entry is attached to the subscription (i.e. "Fach").
   */
  private async getObjectId(
    studentId: Option<number>,
    forTeacher: DossierEntryFormData["forTeacher"],
  ): Promise<number> {
    if (studentId == null) {
      throw new Error("Student ID not present");
    }

    if (forTeacher === "class-teacher-only") {
      const subscriptionId =
        await this.editService.getSubscriptionId(studentId);
      if (!subscriptionId) {
        throw new Error("Subscription ID not found");
      }
      return subscriptionId;
    }

    return studentId;
  }

  private async saveEntry(
    type: "document" | "note",
    entry: Partial<AdditionalInformation>,
    file: Option<File>,
  ): Promise<boolean> {
    try {
      await this.editService.save(type, entry, file);
      return true;
    } catch (error) {
      console.error("Failed to save entry:", error);
      return false;
    }
  }

  private async navigateBack(): Promise<void> {
    await this.router.navigate(["../../"], { relativeTo: this.route });
  }
}
