import {
  AfterViewInit,
  Directive,
  Input,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { Subject, combineLatest, takeUntil } from "rxjs";
import { PortalService } from "src/app/shared/services/portal.service";
import { TestStateService } from "../../services/test-state.service";
import { TestEditGradesHeaderComponent } from "../test-edit-grades-header/test-edit-grades-header.component";

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
  selector: "[bkdTestEditGradesHeaderSticky]",
  standalone: true,
})
export class TestEditGradesHeaderStickyDirective
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() inlineHeader: TestEditGradesHeaderComponent;
  @Input() stickyHeader: TestEditGradesHeaderComponent;

  private destroy$ = new Subject<void>();

  constructor(
    private portal: PortalService,
    private state: TestStateService,
  ) {}

  ngOnInit(): void {
    // Update sticky header sizing whenever the columns count/widths may change
    combineLatest([this.state.filteredTests$, this.state.expandedHeader$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => setTimeout(() => this.updateStickyWidth()));
  }

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
    const inlineTop = this.inlineHeader.getTop() + this.getIframeScrollY();
    this.stickyHeader.shown = this.getScrollTop() > inlineTop;
  }

  private updateStickyTopOffset(): void {
    if (this.isSmallBreakpointDown()) return;
    this.stickyHeader.setTopOffset(
      this.portal.inIframe ? this.getScrollTop() : 0,
    );
  }

  private updateStickyLeftOffset(): void {
    if (this.isSmallBreakpointDown()) return;
    this.stickyHeader.setLeftOffset(this.inlineHeader.getLeft());
  }

  private updateStickyWidth(): void {
    if (this.isSmallBreakpointDown()) return;
    this.stickyHeader.setWidth(this.inlineHeader.getWidth());
    this.stickyHeader.setColumnWidths(this.inlineHeader.getColumnWidths());
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
