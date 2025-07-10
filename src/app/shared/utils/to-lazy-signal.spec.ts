/**
 * MIT-licensed, from the ngxtension project, see
 * https://ngxtension.netlify.app/utilities/signals/to-lazy-signal/ and
 * https://github.com/ngxtension/ngxtension-platform/blob/main/libs/ngxtension/to-lazy-signal/src/to-lazy-signal.spec.ts
 */
import { Component, type Signal, signal } from "@angular/core";
import { TestBed, fakeAsync } from "@angular/core/testing";
import { Observable } from "rxjs";
import { toLazySignal } from "./to-lazy-signal";

/**
 * https://stackblitz.com/edit/stackblitz-starters-wxbnsh?devToolsHeight=33&file=src%2Fmain.ts
 */
describe("toLazySignal", () => {
  let subscribed = 0;

  @Component({
    standalone: true,
    template: `
      @if ($display1()) {
        <div>{{ $s() }}</div>
      }
      @if ($display2()) {
        <div>{{ $s() }}</div>
      }
    `,
  })
  class Foo {
    public readonly $display1 = signal<boolean>(false);
    public readonly $display2 = signal<boolean>(false);
    protected readonly $s: Signal<string | undefined>;

    constructor() {
      const obs = new Observable<string | undefined>((subscriber) => {
        subscribed++;
        subscriber.next("test");
      });

      this.$s = toLazySignal<string | undefined>(obs);
    }
  }

  it("should subscribe lazily and only once", fakeAsync(() => {
    const fixture = TestBed.createComponent(Foo);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(subscribed).toEqual(0);

    component.$display1.set(true);
    fixture.detectChanges();

    expect(subscribed).toEqual(1);

    component.$display1.set(false);
    fixture.detectChanges();

    expect(subscribed).toEqual(1);

    component.$display2.set(true);
    fixture.detectChanges();

    expect(subscribed).toEqual(1);
  }));
});
