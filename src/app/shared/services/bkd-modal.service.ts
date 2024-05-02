import { Injectable } from "@angular/core";
import {
  // eslint-disable-next-line no-restricted-imports
  NgbModal,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";

/**
 * Drop-in replacement for NgbModal that wraps the NgbModal and
 * adjusts the modal position/height when running within Evento Portal
 * iframe.
 */
@Injectable({
  providedIn: "root",
})
export class BkdModalService {
  constructor(private modal: NgbModal) {}

  /**
   * Delegated to NgbModal.open, but – when running within iframe –
   * applies the Evento Portal content's scroll offset to the modal
   * window component and limits its height.
   */
  open(
    ...args: Parameters<typeof this.modal.open>
  ): ReturnType<typeof this.modal.open> {
    const modalRef = this.modal.open(...args);

    this.applyPortalOffsetAndMaxHeight(modalRef);
    this.disablePortalScrolling(modalRef);

    return modalRef;
  }

  /**
   * Delegated to NgbModal.activeInstances.
   */
  get activeInstances(): typeof this.modal.activeInstances {
    return this.modal.activeInstances;
  }

  /**
   * Delegated to NgbModal.dismissAll.
   */
  dismissAll(
    ...args: Parameters<typeof this.modal.dismissAll>
  ): ReturnType<typeof this.modal.dismissAll> {
    return this.modal.dismissAll(...args);
  }

  /**
   * Delegated to NgbModal.hasOpenModals.
   */
  hasOpenModals(
    ...args: Parameters<typeof this.modal.hasOpenModals>
  ): ReturnType<typeof this.modal.hasOpenModals> {
    return this.modal.hasOpenModals(...args);
  }

  private applyPortalOffsetAndMaxHeight(modalRef: NgbModalRef): void {
    const modalWindowElement = this.getModalWindowElement(modalRef);
    if (!modalWindowElement) {
      console.warn(
        "Trying to apply portal offset to <ngb-modal-window>, but element is not present!",
      );
      return;
    }

    if (this.portalWindow) {
      // We're running within the Evento Portal iframe
      modalWindowElement.style.top = `${this.getModalIframeOffset()}px`;
      modalWindowElement.style.maxHeight = `${this.getModalHeight()}px`;
    }
  }

  /**
   * Hides the portal's scroll bar and shows it again, when the modal
   * is closed.
   */
  disablePortalScrolling(modalRef: NgbModalRef): void {
    if (this.portalWindow && this.portalDocument) {
      // On certain browsers/OSes the scrollbar consumes horizontal space, so
      // the hiding of the scrollbar will change the width of the content. To
      // avoid this, we compensate the scrollbar width with a padding on the
      // document.
      const portalScrollbarWidth =
        this.portalWindow.innerWidth - this.portalDocument.clientWidth;
      this.portalDocument.style.paddingRight = `${portalScrollbarWidth}px`;

      // Hide scrollbar by disabling overflowing
      this.portalDocument.style.overflow = "hidden";
    }
    modalRef.hidden.subscribe(() => {
      if (this.portalDocument) {
        this.portalDocument.style.paddingRight = "0px";
        this.portalDocument.style.overflow = "auto";
      }
    });
  }

  /**
   * Returns the <modal-window-element> of the given modal.
   */
  private getModalWindowElement(modalRef: NgbModalRef): Option<HTMLElement> {
    // Apparently, to get a reference of the <modal-window-element> we
    // have to navigate through some private properties
    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (modalRef as any)._windowCmptRef?.instance?._elRef?.nativeElement ?? null
    );
  }

  /**
   * Returns the offset the modal window should have within the
   * iframe.
   */
  private getModalIframeOffset(): number {
    return Math.max(this.getViewportTop() - this.getIframeTop(), 0);
  }

  /**
   * Returns the top position of the content iframe relative to the
   * Evento Portal document.
   */
  private getIframeTop(): number {
    const iframe =
      this.portalQuerySelector("bkd-content")?.shadowRoot?.querySelector(
        "iframe",
      );
    return iframe?.offsetTop ?? 0;
  }

  /**
   * Returns the bottom position of the content iframe relative to the
   * Evento Portal document.
   */
  private getIFrameBottom(): number {
    const iframe =
      this.portalQuerySelector("bkd-content")?.shadowRoot?.querySelector(
        "iframe",
      );
    return iframe ? iframe.offsetTop + iframe.offsetHeight : 0;
  }

  /**
   * Returns the top position of the modal window relative to the
   * Evento Portal document.
   */
  private getModalTop(): number {
    return Math.max(this.getViewportTop(), this.getIframeTop());
  }

  /**
   * Returns the bottom position of the modal window relative to the
   * Evento Portal document.
   */
  private getModalBottom(): number {
    return Math.min(this.getViewportBottom(), this.getIFrameBottom());
  }

  /**
   * Returns the maximum height the modal window can have.
   */
  private getModalHeight(): number {
    return this.getModalBottom() - this.getModalTop();
  }

  /**
   * Returns the top position of the visible browser viewport relative
   * to the Evento Portal document.
   */
  private getViewportTop(): number {
    return this.portalWindow?.scrollY ?? 0;
  }

  /**
   * Returns the bottom position of the visible browser viewport
   * relative to the Evento Portal document.
   */
  private getViewportBottom(): number {
    return this.getViewportTop() + this.getViewportHeight();
  }

  /**
   * Returns the height of the visible browser viewport.
   */
  private getViewportHeight(): number {
    return this.portalWindow?.innerHeight ?? 0;
  }

  /**
   * Select an element within the <bkd-portal>'s shadow DOM.
   */
  private portalQuerySelector(selector: string): Option<Element> {
    return (
      this.portalWindow?.document
        ?.querySelector("bkd-portal")
        ?.shadowRoot?.querySelector(selector) ?? null
    );
  }

  /**
   * Returns the document element of the Evento Portal when running
   * within the Evento Portal's iframe or `null` when running
   * standalone during development.
   */
  private get portalDocument(): Option<HTMLElement> {
    return this.portalWindow?.document.documentElement ?? null;
  }

  /**
   * Returns the Window object of the Evento Portal when running
   * within the Evento Portal's iframe or `null` when running
   * standalone during development.
   */
  private get portalWindow(): Option<Window> {
    return window.parent === window ? null : window.parent;
  }
}
