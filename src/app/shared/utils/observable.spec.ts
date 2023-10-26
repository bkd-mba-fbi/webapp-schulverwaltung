import { fakeAsync, tick } from "@angular/core/testing";
import { Subject } from "rxjs";
import {
  defaultValue,
  intervalOnInactivity,
  reemitOnTrigger,
} from "./observable";

describe("observable utilities", () => {
  let callback: jasmine.Spy;
  beforeEach(() => {
    callback = jasmine.createSpy("callback");
  });

  describe("defaultValue", () => {
    let source$: Subject<Maybe<number>>;
    beforeEach(() => {
      source$ = new Subject<Maybe<number>>();
      source$.pipe(defaultValue(42)).subscribe(callback);
      expect(callback).not.toHaveBeenCalled();
    });

    it("emits default value if source completes without emitting value", () => {
      source$.complete();
      expect(callback).toHaveBeenCalledWith(42);
    });

    it("emits default value for null source value", () => {
      source$.next(null);
      expect(callback).toHaveBeenCalledWith(42);
    });

    it("emits default value for undefined source value", () => {
      source$.next(undefined);
      expect(callback).toHaveBeenCalledWith(42);
    });

    it("emits actual source value if not null/undefined", () => {
      source$.next(0);
      expect(callback).toHaveBeenCalledWith(0);
    });
  });

  describe("reemitOnTrigger", () => {
    it("emits the values of source and the last value of source whenever trigger emits", () => {
      const source$ = new Subject<number>();
      const trigger$ = new Subject<void>();
      reemitOnTrigger(source$, trigger$).subscribe(callback);
      expect(callback).not.toHaveBeenCalled();

      source$.next(1);
      expect(callback).toHaveBeenCalledWith(1);

      callback.calls.reset();
      source$.next(2);
      expect(callback).toHaveBeenCalledWith(2);

      callback.calls.reset();
      trigger$.next();
      expect(callback).toHaveBeenCalledWith(2);

      callback.calls.reset();
      source$.next(3);
      expect(callback).toHaveBeenCalledWith(3);

      callback.calls.reset();
      source$.next(4);
      expect(callback).toHaveBeenCalledWith(4);

      callback.calls.reset();
      trigger$.next();
      expect(callback).toHaveBeenCalledWith(4);
    });
  });

  describe("intervalOnInactivity", () => {
    it("emits value every specified interval of time within periods of inactivity", fakeAsync(() => {
      const sub = intervalOnInactivity(2000).subscribe(callback);
      expect(callback).not.toHaveBeenCalled();

      // No emitting mid-period
      tick(1000);
      expect(callback).not.toHaveBeenCalled();

      // Mouse/keyboard activity restarts interval period
      document.querySelector("body")!.click();
      tick(1000);
      expect(callback).not.toHaveBeenCalled();

      // No emitting when original period ends
      tick(1000);
      expect(callback).toHaveBeenCalledTimes(1);

      // Value is emitted when restarted period ends
      tick(2000);
      expect(callback).toHaveBeenCalledTimes(2);

      sub.unsubscribe();

      // No emitting after unsubscribing
      tick(10000);
      expect(callback).toHaveBeenCalledTimes(2);
    }));
  });
});
