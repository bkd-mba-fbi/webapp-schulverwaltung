import {
  AfterViewInit,
  Directive,
  OnDestroy,
  inject,
  input,
} from "@angular/core";
import { PortalService } from "src/app/shared/services/portal.service";
import { TableHeaderComponent } from "../table-header/table-header.component";

const MEDIA_BREAKPOINT_SM = 576;

/**
 * There are two versions of the table header:
 * - The inline version that scrolls with the table
 * - The sticky version that is fixed to the top
 *
 * This directive handles the toggling of the sticky version of the table header
 * and updates its position & width on scrolling/resizing. This is implemented
 * via JavaScript, since it is not possible to solve with CSS, especially
 * when used inside the Evento Portal iframe.
 */
@Directive({
  selector: "[bkdTableHeaderSticky]",
  standalone: true,
})
export class TableHeaderStickyDirective implements AfterViewInit, OnDestroy {
  private portal = inject(PortalService);

  inlineHeader = input.required<TableHeaderComponent>();
  stickyHeader = input.required<TableHeaderComponent>();

  ngAfterViewInit(): void {
    // Position/resize the sticky header initially
    this.handleWindowScroll();
    this.handleTableScroll();
    this.handleWindowResize();

    this.window.addEventListener("scroll", this.handleWindowScroll);
    this.getTableScrollContainer()?.addEventListener(
      "scroll",
      this.handleTableScroll,
    );
    this.window.addEventListener("resize", this.handleWindowResize);
  }

  ngOnDestroy(): void {
    this.window.removeEventListener("scroll", this.handleWindowScroll);
    this.getTableScrollContainer()?.removeEventListener(
      "scroll",
      this.handleTableScroll,
    );
    this.window.removeEventListener("resize", this.handleWindowResize);
  }

  /**
   * Call whenever the columns count/widths may change to update sticker header
   * sizing.
   */
  refresh(): void {
    setTimeout(() => this.updateStickyWidth());
  }

  private get window(): Window {
    // Either the portal window if inside iframe, or the current window if
    // standalone
    return this.portal.window ?? window;
  }

  private getTableScrollContainer(): HTMLElement | null {
    return document.querySelector(".table-responsive-wrapper") ?? null;
  }

  /**
   * Handle vertical scrolling of the table
   */
  private handleWindowScroll = (): void => {
    this.updateStickyVisibility();
    this.updateStickyTopOffset();
  };

  /**
   * Handling resizing of the table
   */
  private handleWindowResize = (): void => {
    this.updateStickyWidth();

    // Update the positioning as well since it my have changed due to layout
    // shifts (responsive breakpoint)
    this.updateStickyVisibility();
    this.updateStickyTopOffset();
  };

  /**
   * Handle horizontal scrolling of the table
   */
  private handleTableScroll = (): void => {
    this.updateStickyLeftOffset();
  };

  private updateStickyVisibility(): void {
    if (this.isSmallBreakpointDown()) return;
    const inlineTop = this.inlineHeader().getTop() + this.getIframeScrollY();
    this.stickyHeader().shown.set(this.getScrollTop() > inlineTop);
  }

  private updateStickyTopOffset(): void {
    if (this.isSmallBreakpointDown()) return;
    this.stickyHeader().setTopOffset(
      this.portal.inIframe ? this.getScrollTop() : 0,
    );
  }

  private updateStickyLeftOffset(): void {
    if (this.isSmallBreakpointDown()) return;
    this.stickyHeader().setLeftOffset(this.inlineHeader().getLeft());
  }

  private updateStickyWidth(): void {
    if (this.isSmallBreakpointDown()) return;
    this.stickyHeader().setWidth(this.inlineHeader().getWidth());
    this.stickyHeader().setColumnWidths(this.inlineHeader().getColumnWidths());

    // FIREFOX HACK: Set the heights of the fixed positioned sticky columns,
    // see test-edit-grades-header.component.scss for more info
    this.stickyHeader().setStickyColumnHeights(
      this.inlineHeader().getStickyColumnsHeights(),
    );
  }

  /**
   * Scroll position within iframe
   */
  private getScrollTop(): number {
    return this.window.scrollY - this.portal.getIframeTop();
  }

  private getIframeScrollY(): number {
    // Only relevant when used standalone, is always 0 if inside portal iframe
    return window.scrollY;
  }

  /**
   * Check if we are on mobile, since there is no sticky header there and hence
   * nothing to calculate.
   */
  private isSmallBreakpointDown(): boolean {
    return window.innerWidth < MEDIA_BREAKPOINT_SM;
  }
}
