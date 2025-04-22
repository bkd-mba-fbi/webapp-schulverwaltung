import {
  Component,
  ElementRef,
  HostBinding,
  effect,
  inject,
  input,
  signal,
} from "@angular/core";

/**
 * Abstract component for a sticky table header that is controlled by the
 * `TableHeaderStickyDirective`. See `TestEditGradesHeaderComponent` or
 * `EvaluationTableHeaderComponent` for concrete implementations.
 */
@Component({
  template: "",
})
export abstract class TableHeaderComponent {
  private element = inject<ElementRef<HTMLElement>>(ElementRef);

  /**
   * Set to false for the inline version of the header, true for the sticky (or
   * fixed) version of the header.
   */
  sticky = input(false);

  @HostBinding("class.sticky")
  get stickyClass() {
    return this.sticky();
  }

  shown = signal<boolean>(false);
  constructor() {
    effect(this.updateShownClass.bind(this));
  }

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
   * FIREFOX HACK: See TableHeaderStickyDirective
   */
  getStickyColumnsHeights(): ReadonlyArray<ReadonlyArray<number>> {
    return this.getRowsAndColumns(".sticky").map((columns) =>
      columns.map((column) => column.getBoundingClientRect().height),
    );
  }

  /**
   * FIREFOX HACK: See TableHeaderStickyDirective
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

  private updateShownClass(): void {
    const classList = this.element.nativeElement.classList;
    if (this.shown()) {
      classList.add("shown");
    } else {
      classList.remove("shown");
    }
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
