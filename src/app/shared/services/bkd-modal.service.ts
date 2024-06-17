import { Injectable } from "@angular/core";
import {
  // eslint-disable-next-line no-restricted-imports
  NgbModal,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { PortalService } from "./portal.service";

/**
 * Drop-in replacement for NgbModal that wraps the NgbModal and
 * adjusts the modal position/height when running within Evento Portal
 * iframe.
 */
@Injectable({
  providedIn: "root",
})
export class BkdModalService {
  constructor(
    private modal: NgbModal,
    private portal: PortalService,
  ) {}

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

    if (this.portal.window) {
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
    if (this.portal.window && this.portal.document) {
      // On certain browsers/OSes the scrollbar consumes horizontal space, so
      // the hiding of the scrollbar will change the width of the content. To
      // avoid this, we compensate the scrollbar width with a padding on the
      // document.
      const portalScrollbarWidth =
        this.portal.window.innerWidth - this.portal.document.clientWidth;
      this.portal.document.style.paddingRight = `${portalScrollbarWidth}px`;

      // Hide scrollbar by disabling overflowing
      this.portal.document.style.overflow = "hidden";
    }
    modalRef.hidden.subscribe(() => {
      if (this.portal.document) {
        this.portal.document.style.paddingRight = "0px";
        this.portal.document.style.overflow = "auto";
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
    return Math.max(this.getViewportTop() - this.portal.getIframeTop(), 0);
  }

  /**
   * Returns the top position of the modal window relative to the
   * Evento Portal document.
   */
  private getModalTop(): number {
    return Math.max(this.getViewportTop(), this.portal.getIframeTop());
  }

  /**
   * Returns the bottom position of the modal window relative to the
   * Evento Portal document.
   */
  private getModalBottom(): number {
    return Math.min(this.getViewportBottom(), this.portal.getIFrameBottom());
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
    return this.portal.window?.scrollY ?? 0;
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
    return this.portal.window?.innerHeight ?? 0;
  }
}
