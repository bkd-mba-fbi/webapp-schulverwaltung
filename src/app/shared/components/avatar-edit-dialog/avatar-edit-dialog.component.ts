import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { firstValueFrom, of, switchMap, throwError } from "rxjs";
import { AdditionalInformationsRestService } from "../../services/additional-informations-rest.service";
import { CroptService } from "../../services/cropt.service";
import { FileInputComponent } from "../file-input/file-input.component";
import { SpinnerComponent } from "../spinner/spinner.component";

type AvatarEditDialogStep = "choose" | "crop" | "uploading";

@Component({
  selector: "bkd-avatar-edit-dialog",
  imports: [TranslatePipe, FileInputComponent, SpinnerComponent],
  providers: [CroptService],
  templateUrl: "./avatar-edit-dialog.component.html",
  styleUrl: "./avatar-edit-dialog.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarEditDialogComponent {
  activeModal = inject(NgbActiveModal);
  translate = inject(TranslateService);
  private croptService = inject(CroptService);
  private additionalInformationsRestService = inject(
    AdditionalInformationsRestService,
  );

  studentId = signal<number>(0);

  step = signal<AvatarEditDialogStep>("choose");

  acceptedExtensions = [".jpg", ".jpeg", ".png"];
  acceptedMimeTypes = ["image/jpeg", "image/png"];
  file = signal<Option<File>>(null);
  invalidFile = computed(
    () =>
      this.file() && !this.acceptedMimeTypes.includes(this.file()?.type ?? ""),
  );
  error = signal<Option<unknown>>(null);

  cropElement = viewChild<ElementRef<HTMLDivElement>>("cropElement");

  saving = signal(false);

  canCancel = computed(() => this.step() !== "uploading" || !this.saving());
  canProceed = computed(() => {
    switch (this.step()) {
      case "choose":
        return this.file() !== null && !this.invalidFile();
      case "crop":
        return !this.error();
    }
    return false;
  });
  cancelLabel = computed(() =>
    this.translate.instant(
      this.error()
        ? "shared.avatar-edit.dialog.close"
        : "shared.avatar-edit.dialog.cancel",
    ),
  );
  proceedLabel = computed(() =>
    this.translate.instant(
      this.step() === "crop"
        ? "shared.avatar-edit.dialog.save"
        : "shared.avatar-edit.dialog.next",
    ),
  );

  constructor() {
    this.croptService.configure({
      cropSize: { width: 240, height: 320 },
      cropImageType: "image/jpeg",
    });

    // Set the image to crop once the "crop" step is reached
    effect(() => {
      if (this.step() === "crop") {
        this.croptService.setImage(
          this.cropElement()?.nativeElement ?? null,
          this.file(),
        );
      }
    });

    // Subscribe to crop service errors
    effect(() => {
      this.error.set(this.croptService.error());
    });
  }

  async proceed(): Promise<void> {
    switch (this.step()) {
      case "choose":
        this.step.set("crop");
        break;
      case "crop": {
        // Read the image canvas while it is still in the DOM
        const image = await this.croptService.getCroppedImage();
        this.step.set("uploading");
        await this.upload(image);
        break;
      }
    }
  }

  private upload(image: Option<File>): Promise<void> {
    this.saving.set(true);
    const upload$ = of(image).pipe(
      switchMap((image) =>
        image
          ? of(image)
          : throwError(() => new Error("No avatar image available")),
      ),
      switchMap((image) =>
        this.additionalInformationsRestService.uploadPhoto(
          this.studentId(),
          image,
        ),
      ),
    );
    upload$.subscribe({
      next: () => {
        this.saving.set(false);
        this.activeModal.close(true);
      },
      error: (error) => {
        this.saving.set(false);
        this.error.set(error);
        console.error(error);
      },
    });
    return firstValueFrom(upload$);
  }
}
