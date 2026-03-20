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
   * Returns the full height of the document, including the the non-visible
   * portion outside of the browser's viewport.
   */
  getDocumentHeight(): number {
    return this.document?.offsetHeight ?? 0;
  }

  /**
   * Returns the top position of the visible area in the browser window,
   * relative to the document.
   */
  getViewportTop(): number {
    return this.window?.scrollY ?? 0;
  }

  /**
   * Returns the bottom position of the visible area in the browser window,
   * relative to the document.
   */
  getViewportBottom(): number {
    return this.getViewportTop() + this.getViewportHeight();
  }

  /**
   * Returns the height of the height of the browser window (visible area of the document).
   */
  getViewportHeight(): number {
    return this.window?.innerHeight ?? 0;
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

  getFooterHeight(): number {
    return this.querySelector<HTMLElement>("bkd-footer")?.offsetHeight ?? 0;
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

  /**
   * Returns the height of the visible portion of the iframe (the part of the
   * iframe that is within the viewport).
   */
  getVisibleIframeHeight(): number {
    const top = Math.max(this.getIframeTop(), this.getViewportTop());
    const contentBottom = this.getDocumentHeight() - this.getFooterHeight();
    const bottom = Math.min(contentBottom, this.getViewportBottom());
    return bottom - top;
  }
}
