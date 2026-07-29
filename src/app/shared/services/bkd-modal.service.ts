import {
  ComponentRef,
  Injectable,
  InputSignalWithTransform,
  Type,
  inject,
} from "@angular/core";
import {
  // eslint-disable-next-line no-restricted-imports
  NgbModal,
  NgbModalOptions,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { PortalService } from "./portal.service";

type SignalInputWriteType<C, K extends keyof C> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  C[K] extends InputSignalWithTransform<any, infer WriteT> ? WriteT : never;

/**
 * Wrapper of `NgbModalRef` that provides a type-safe `setInput()` to update the component's input signals.
 */
export interface BkdModalRef<TComponent> extends NgbModalRef {
  setInput<TKey extends keyof TComponent>(
    name: TKey,
    value: SignalInputWriteType<TComponent, TKey>,
  ): void;
}

/**
 * Drop-in replacement for NgbModal that wraps the NgbModal and
 * adjusts the modal position/height when running within Evento Portal
 * iframe.
 */
@Injectable({
  providedIn: "root",
})
export class BkdModalService {
  private modal = inject(NgbModal);
  private portal = inject(PortalService);

  /**
   * Delegated to NgbModal.open, but – when running within iframe –
   * applies the Evento Portal content's scroll offset to the modal
   * window component and limits its height.
   */
  open<TComponent>(
    component: Type<TComponent>,
    options?: NgbModalOptions,
  ): BkdModalRef<TComponent> {
    const modalRef = this.modal.open(component, options);

    this.applyPortalOffsetAndMaxHeight(modalRef);
    this.disablePortalScrolling(modalRef);

    const componentRef = this.getComponentRef<TComponent>(modalRef);
    if (!componentRef) throw new Error("ComponentRef not available");

    return Object.assign(modalRef, {
      setInput: (name: PropertyKey, value: unknown) => {
        componentRef.setInput(name as string, value);
      },
    });
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
    if (!this.portal.window) {
      // We are not running within the Evento Portal iframe
      return;
    }

    const apply = (): void => {
      modalWindowElement.style.top = `${this.getModalIframeOffset()}px`;
      modalWindowElement.style.maxHeight = `${this.portal.getVisibleIframeHeight()}px`;
    };

    // Initially
    apply();

    // On resize
    this.portal.window.addEventListener("resize", apply);
    modalRef.hidden.subscribe(() => {
      if (this.portal.window) {
        this.portal.window.removeEventListener("resize", apply);
      }
    });
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
   * Returns the `ComponentRef` of the given modal's content component
   * (`NgbModalRef` only exposes `componentInstance`).
   */
  private getComponentRef<C>(modalRef: NgbModalRef): Option<ComponentRef<C>> {
    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (modalRef as any)._contentRef?.componentRef ?? null
    );
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
    return Math.max(
      this.portal.getViewportTop() - this.portal.getIframeTop(),
      0,
    );
  }
}
