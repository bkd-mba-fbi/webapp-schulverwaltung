import { Injectable } from "@angular/core";

/**
 * This service allows to access the Evento Portal's DOM elements from within
 * the iframe.
 */
@Injectable({
  providedIn: "root",
})
export class PortalService {
  constructor() {}

  /**
   * Returns true when running inside Event Portal iframe.
   */
  get inIframe(): boolean {
    return window.parent !== window;
  }

  /**
   * Returns the Window object of the Evento Portal when running
   * within the Evento Portal's iframe or `null` when running
   * standalone during development.
   */
  get window(): Option<Window> {
    return this.inIframe ? window.parent : null;
  }

  /**
   * Returns the document element of the Evento Portal when running
   * within the Evento Portal's iframe or `null` when running
   * standalone during development.
   */
  get document(): Option<HTMLElement> {
    return this.window?.document.documentElement ?? null;
  }

  /**
   * Select an element within the <bkd-portal>'s shadow DOM.
   */
  querySelector<E extends Element = Element>(selector: string): Option<E> {
    return (
      this.window?.document
        ?.querySelector("bkd-portal")
        ?.shadowRoot?.querySelector<E>(selector) ?? null
    );
  }

  getIframeElement(): HTMLElement | null {
    return (
      this.querySelector("bkd-content")?.shadowRoot?.querySelector("iframe") ??
      null
    );
  }

  /**
   * Returns the top position of the content iframe relative to the
   * Evento Portal document.
   */
  getIframeTop(): number {
    return this.getIframeElement()?.offsetTop ?? 0;
  }

  /**
   * Returns the bottom position of the content iframe relative to the
   * Evento Portal document.
   */
  getIFrameBottom(): number {
    const iframe = this.getIframeElement();
    return iframe ? iframe.offsetTop + iframe.offsetHeight : 0;
  }

  /**
   * Returns the available height of the viewport for the iframe (excluding
   * header & footer). Use this value for static layouts that should use the
   * full viewport.
   */
  getAvailableViewportHeight(): number {
    return Math.max(
      this.getViewportHeight() - this.getIframeTop() - this.getFooterHeight(),
      0,
    );
  }

  private getViewportHeight(): number {
    return this.document?.offsetHeight ?? 0;
  }

  private getFooterHeight(): number {
    return this.querySelector<HTMLElement>("bkd-footer")?.offsetHeight ?? 0;
  }
}
