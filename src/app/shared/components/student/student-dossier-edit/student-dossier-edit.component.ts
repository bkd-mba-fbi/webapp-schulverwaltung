import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormField, disabled, form, required } from "@angular/forms/signals";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { switchMap } from "rxjs";
import { SETTINGS, Settings } from "src/app/settings";
import { AdditionalInformation } from "src/app/shared/models/additional-informations.model";
import { DropDownItem } from "src/app/shared/models/drop-down-item.model";
import { BkdModalService } from "src/app/shared/services/bkd-modal.service";
import { StudentDossierEditService } from "src/app/shared/services/student-dossier-edit.service";
import { ToastService } from "src/app/shared/services/toast.service";
import { fileType } from "src/app/shared/validators/file-type.validator";
import { maxFileSize } from "src/app/shared/validators/max-file-size.validator";
import { ButtonGroupComponent } from "../../button-group/button-group.component";
import { FileInputComponent } from "../../file-input/file-input.component";
import { FormErrorsComponent } from "../../form-errors/form-errors.component";
import { SelectComponent } from "../../select/select.component";
import { SpinnerComponent } from "../../spinner/spinner.component";
import { SubmitButtonComponent } from "../../submit-button/submit-button.component";
import { StudentDossierDeleteDialogComponent } from "../student-dossier-delete-dialog/student-dossier-delete-dialog.component";

interface DossierEntryFormData {
  type: "document" | "note";
  file: Option<File>;
  designation: string;
  description: string;
  category: Option<DropDownItem["Key"]>;
  objectId: Option<number>;
  forTeacher: "class-teacher-only" | "all";
  forStudent: boolean;
}

const CLASS_TEACHER_OBJECT_TYPE_ID = 2;
const ALL_TEACHERS_OBJECT_TYPE_ID = 3;

@Component({
  selector: "bkd-student-dossier-edit",
  imports: [
    RouterLink,
    FormField,
    TranslatePipe,
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
  private modalService = inject(BkdModalService);
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
  classTeacherObject = toSignal(
    this.editService.studentId$.pipe(
      switchMap((studentId) =>
        this.editService.getClassTeacherObject(studentId),
      ),
    ),
    {
      initialValue: {
        objectId: null,
        objectOptions: undefined,
      },
    },
  );

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

  entryFormData = linkedSignal<DossierEntryFormData>(() => {
    const info = this.additionalInformation();
    return {
      type: info ? (info.File ? "document" : "note") : "document",
      file: null,
      designation: info?.Designation ?? "",
      description: info?.Description ?? "",
      category: info?.CodeId ?? null,
      forTeacher: info
        ? info.ObjectTypeId === CLASS_TEACHER_OBJECT_TYPE_ID
          ? "class-teacher-only"
          : "all"
        : "class-teacher-only",
      forStudent: info?.ForStudent ?? true,
      objectId: info?.ObjectId ?? null,
    };
  });
  entryForm = form(this.entryFormData, (schema) => {
    const editing = () => Boolean(this.additionalInformation());
    const isDocument = () => this.entryFormData().type === "document";
    const hasFile = () => isDocument() && !editing();

    required(schema.type);

    required(schema.file, {
      when: hasFile,
    });
    maxFileSize(schema.file, {
      maxBytes: this.settings.dossierMaxFileSize,
      when: hasFile,
    });
    fileType(schema.file, {
      acceptedFileTypes: this.acceptedFileTypes,
      when: hasFile,
    });

    required(schema.designation);

    required(schema.category);

    required(schema.forTeacher);
    disabled(schema.forTeacher, editing);

    required(schema.objectId);
    disabled(schema.objectId, editing);
  });

  submitted = signal(false);

  constructor() {
    effect(() => this.updateFormObjectId());
  }

  async delete() {
    const info = this.additionalInformation();
    const id = info?.Id;
    if (!info || !id) {
      return;
    }

    const modalRef = this.modalService.open(
      StudentDossierDeleteDialogComponent,
    );
    modalRef.componentInstance.type = info.File ? "document" : "note";

    let result = false;
    try {
      result = await modalRef.result;
    } catch {
      result = false;
    }

    if (result) {
      const success = await this.deleteEntry(id);
      if (success) {
        this.toastService.success(
          this.translate.instant("student.dossier.delete.delete-success"),
        );
        await this.navigateBack();
      } else {
        this.toastService.error(
          this.translate.instant("student.dossier.delete.delete-error"),
        );
      }
    }
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    this.submitted.set(true);

    if (this.entryForm().invalid()) {
      return;
    }

    this.saving.set(true);
    try {
      const entry = this.buildEntry(this.entryFormData());
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

  private buildEntry(
    formData: DossierEntryFormData,
  ): Partial<AdditionalInformation> {
    const info = this.additionalInformation();
    const {
      designation,
      description,
      category,
      forTeacher,
      forStudent,
      objectId,
    } = formData;

    if (!objectId) {
      throw new Error("Object ID is not defined");
    }

    const entry: Partial<AdditionalInformation> = {
      ObjectId: objectId,
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

    if (info?.Id) {
      entry.Id = info?.Id;
    }

    return entry;
  }

  private updateFormObjectId(): void {
    const infoId = this.additionalInformationId();
    if (infoId) {
      // When editing, the form is initialized with the objectId from the entry
      return;
    }

    // Update the objectId value; we don't want to do this in the
    // `entryFormData` signal, since this would trigger unwanted resets of the
    // form state.
    if (this.entryForm.forTeacher().value() === "class-teacher-only") {
      // The entry must be visible for class teachers only, so it is attached
      // to the determined subscription. If not found (typically if the user
      // is the principal/"Schulleitung" and there are multiple classes that
      // could be concerned), the user has to manually select a class to
      // associate it with.
      const { objectId } = this.classTeacherObject();
      this.entryForm.objectId().value.set(objectId ?? null);
    } else {
      // Entry must be visible for all teachers of the class (incl.
      // "Fachlehrpersonen"), so associate it with the student.
      this.entryForm.objectId().value.set(this.studentId());
    }
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

  private async deleteEntry(id: number): Promise<boolean> {
    try {
      await this.editService.delete(id);
      return true;
    } catch (error) {
      console.error("Failed to delete entry:", error);
      return false;
    }
  }

  private async navigateBack(): Promise<void> {
    await this.router.navigate(["../../"], { relativeTo: this.route });
  }
}
