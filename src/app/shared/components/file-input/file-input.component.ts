import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  computed,
  input,
  model,
  signal,
  viewChild,
} from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { getExtensionFromMimeType } from "../../utils/mime";

@Component({
  selector: "bkd-file-input",
  imports: [TranslatePipe],
  templateUrl: "./file-input.component.html",
  styleUrl: "./file-input.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileInputComponent implements AfterViewInit, OnDestroy {
  /**
   * Example: [".xls", ".xlsx", ".csv", "image/png"]
   */
  readonly acceptedFileTypes = input.required<ReadonlyArray<string>>();
  readonly error = input<Option<string>>(null);
  readonly value = model<Option<File>>(null);

  protected readonly acceptedFileExtensions = computed(() =>
    this.acceptedFileTypes().map(this.getFileExtensionForType.bind(this)),
  );

  protected readonly dragging = signal(false); // Used to show the drop zone when dragging a file into the viewport
  private dragCount = 0;

  private readonly fileInput =
    viewChild.required<ElementRef<HTMLInputElement>>("fileInput");

  ngAfterViewInit(): void {
    document.addEventListener("dragenter", this.onDragEnter);
    document.addEventListener("dragleave", this.onDragLeave);
  }

  ngOnDestroy(): void {
    document.removeEventListener("dragenter", this.onDragEnter);
    document.removeEventListener("dragleave", this.onDragLeave);
  }

  protected onFileInput(files: FileList | null): void {
    this.value.set(files?.item(0) ?? null);
  }

  private readonly onDragEnter = () => {
    this.dragCount += 1;
    if (this.dragCount === 1) {
      this.dragging.set(true);
    }
  };

  private readonly onDragLeave = () => {
    this.dragCount -= 1;
    if (this.dragCount === 0) {
      this.dragging.set(false);
    }
  };

  protected onFileDrag(event: DragEvent): void {
    event.preventDefault();
  }

  protected onFileDrop(event: DragEvent): void {
    event.preventDefault();

    this.dragCount = 0;
    this.dragging.set(false);

    const input = this.fileInput().nativeElement;
    input.files = event.dataTransfer?.files ?? null;
    input.dispatchEvent(new Event("change"));
  }

  private getFileExtensionForType(fileType: string): string {
    if (fileType.startsWith(".")) {
      return fileType;
    }
    const extension = getExtensionFromMimeType(fileType);
    return extension ? `.${extension}` : fileType;
  }
}
