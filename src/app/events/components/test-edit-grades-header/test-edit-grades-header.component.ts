import { AsyncPipe, NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { Test } from "src/app/shared/models/test.model";
import { TestStateService } from "../../services/test-state.service";
import { TestTableFilterComponent } from "../test-table-filter/test-table-filter.component";
import { TestTableHeaderComponent } from "../test-table-header/test-table-header.component";

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: "thead[bkdTestEditGradesHeader]",
  imports: [
    AsyncPipe,
    NgClass,
    TranslatePipe,
    TestTableFilterComponent,
    TestTableHeaderComponent,
  ],
  templateUrl: "./test-edit-grades-header.component.html",
  styleUrl: "./test-edit-grades-header.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestEditGradesHeaderComponent {
  @Input() selectedTest?: Test;

  /**
   * Set to false for the inline version of the header, true for the sticky (or
   * fixed) version of the header.
   */
  @Input()
  @HostBinding("class.sticky")
  sticky = false;

  @Input()
  set shown(shown: boolean) {
    const classList = this.element.nativeElement.classList;
    if (shown) {
      classList.add("shown");
    } else {
      classList.remove("shown");
    }
  }

  @Output() publish = new EventEmitter<Test>();
  @Output() unpublish = new EventEmitter<Test>();

  constructor(
    public state: TestStateService,
    private element: ElementRef<HTMLElement>,
  ) {}

  /**
   * The y position of the header relative to the viewport.
   */
  getTop(): number {
    return this.element.nativeElement.getBoundingClientRect().top;
  }

  /**
   * The x position of the header relative to the viewport.
   */
  getLeft(): number {
    return this.element.nativeElement.getBoundingClientRect().left;
  }

  /**
   * Translate the sticky header vertically.
   */
  setTopOffset(top: number): void {
    this.element.nativeElement.style.top = `${top}px`;
  }

  /**
   * Translate the sticky header horizontally.
   */
  setLeftOffset(left: number): void {
    this.element.nativeElement.style.left = `${left}px`;
  }

  getWidth(): number {
    return this.element.nativeElement.getBoundingClientRect().width;
  }

  setWidth(width: number): void {
    this.element.nativeElement.style.width = `${width}px`;
  }

  getColumnWidths(): ReadonlyArray<ReadonlyArray<number>> {
    return this.getRowsAndColumns().map((columns) =>
      columns.map((column) => column.getBoundingClientRect().width),
    );
  }

  setColumnWidths(columnWidths: ReadonlyArray<ReadonlyArray<number>>): void {
    const rows = this.getRowsAndColumns();

    if (
      rows.length !== columnWidths.length ||
      !rows.every((columns, i) => columns.length === columnWidths[i].length)
    ) {
      throw new Error(
        "Given column widths do not match number of header rows/columns",
      );
    }

    rows.forEach((columns, i) =>
      columns.forEach((column, j) => {
        column.style.width = `${columnWidths[i][j]}px`;
        column.style.minWidth = `${columnWidths[i][j]}px`; // Somehow `width` alone doesn't work
      }),
    );
  }

  /**
   * FIREFOX HACK: See TestEditGradesHeaderStickyDirective
   */
  getStickyColumnsHeights(): ReadonlyArray<ReadonlyArray<number>> {
    return this.getRowsAndColumns(".sticky").map((columns) =>
      columns.map((column) => column.getBoundingClientRect().height),
    );
  }

  /**
   * FIREFOX HACK: See TestEditGradesHeaderStickyDirective
   */
  setStickyColumnHeights(
    columnHeights: ReadonlyArray<ReadonlyArray<number>>,
  ): void {
    const rows = this.getRowsAndColumns(".sticky");

    if (
      rows.length !== columnHeights.length ||
      !rows.every((columns, i) => columns.length === columnHeights[i].length)
    ) {
      throw new Error(
        "Given column heights do not match number of sticky header columns",
      );
    }

    rows.forEach((columns, i) =>
      columns.forEach((column, j) => {
        column.style.height = `${columnHeights[i][j]}px`;
      }),
    );

    // Since the sticky elements will be `fixed`, set the max height on the row
    // as well
    this.getRows().forEach((row, i) => {
      const rowHeight = columnHeights[i].reduce(
        (acc, height) => Math.max(acc, height),
        0,
      );
      row.style.height = `${rowHeight}px`;
    });
  }

  private getRowsAndColumns(
    customColumnsSelector?: string,
  ): ReadonlyArray<ReadonlyArray<HTMLTableCellElement>> {
    return this.getRows().map((row) =>
      Array.from(
        row.querySelectorAll(
          `th:not(.header-mobile)${customColumnsSelector ?? ""}`,
        ),
      ),
    );
  }

  private getRows(): ReadonlyArray<HTMLTableRowElement> {
    return Array.from(this.element.nativeElement.querySelectorAll("tr"));
  }
}
