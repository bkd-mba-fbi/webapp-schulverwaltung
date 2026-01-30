import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  input,
  model,
  signal,
  viewChild,
} from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: "bkd-file-input",
  imports: [TranslatePipe],
  templateUrl: "./file-input.component.html",
  styleUrl: "./file-input.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileInputComponent implements AfterViewInit, OnDestroy {
  /**
   * Example: [".xls", ".xlsx", ".csv"]
   */
  acceptedExtensions = input.required<ReadonlyArray<string>>();
  error = input<Option<string>>(null);
  file = model<Option<File>>(null);

  dragging = signal(false); // Used to show the drop zone when dragging a file into the viewport
  private dragCount = 0;

  private fileInput =
    viewChild.required<ElementRef<HTMLInputElement>>("fileInput");

  ngAfterViewInit(): void {
    document.addEventListener("dragenter", this.onDragEnter);
    document.addEventListener("dragleave", this.onDragLeave);
  }

  ngOnDestroy(): void {
    document.removeEventListener("dragenter", this.onDragEnter);
    document.removeEventListener("dragleave", this.onDragLeave);
  }

  onFileInput(files: FileList | null): void {
    this.file.set(files?.item(0) ?? null);
  }

  onDragEnter = () => {
    this.dragCount += 1;
    if (this.dragCount === 1) {
      this.dragging.set(true);
    }
  };

  onDragLeave = () => {
    this.dragCount -= 1;
    if (this.dragCount === 0) {
      this.dragging.set(false);
    }
  };

  onFileDrag(event: DragEvent): void {
    event.preventDefault();
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();

    this.dragCount = 0;
    this.dragging.set(false);

    const input = this.fileInput().nativeElement;
    input.files = event.dataTransfer?.files ?? null;
    input.dispatchEvent(new Event("change"));
  }
}
