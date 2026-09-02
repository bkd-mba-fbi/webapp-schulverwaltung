import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { TranslatePipe } from "@ngx-translate/core";
import { uniqueId } from "lodash-es";
import { StudentDossierFilterService } from "src/app/shared/services/student-dossier-filter.service";

@Component({
  selector: "bkd-student-dossier-filter",
  imports: [NgSelectModule, FormsModule, TranslatePipe],
  templateUrl: "./student-dossier-filter.component.html",
  styleUrl: "./student-dossier-filter.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentDossierFilterComponent {
  private readonly filterService = inject(StudentDossierFilterService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly dropdownId = uniqueId("student-dossier-filter-dropdown");

  readonly isDropdownOpen = signal(false);
  protected readonly isFilterActive = toSignal(
    this.filterService.isFilterActive$,
    {
      requireSync: true,
    },
  );
  protected readonly categoryOptions = toSignal(
    this.filterService.filterOptions$,
    {
      initialValue: [],
    },
  );

  protected readonly selectedCategories = toSignal(
    this.filterService.selectedCategories$,
    {
      initialValue: [],
    },
  );

  toggleDropdown(): void {
    this.isDropdownOpen.update((open) => !open);
  }

  protected onCategoriesChange(categories: ReadonlyArray<string>): void {
    this.filterService.setSelectedCategories(categories);
  }

  @HostListener("document:click", ["$event.target"])
  protected onDocumentClick(target: EventTarget | null): void {
    if (
      this.isDropdownOpen() &&
      target instanceof Node &&
      !this.host.nativeElement.contains(target)
    ) {
      this.isDropdownOpen.set(false);
    }
  }
}
