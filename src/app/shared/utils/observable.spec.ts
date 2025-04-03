import { HttpErrorResponse } from "@angular/common/http";
import { fakeAsync, tick } from "@angular/core/testing";
import { Subject } from "rxjs";
import {
  catch404,
  defaultValue,
  intervalOnInactivity,
  reemitOnTrigger,
  withReload,
} from "./observable";

describe("observable utilities", () => {
  let callback: jasmine.Spy;
  beforeEach(() => {
    callback = jasmine.createSpy("callback");
  });

  describe("catch404", () => {
    let source$: Subject<number>;
    let errorCallback: jasmine.Spy;
    beforeEach(() => {
      errorCallback = jasmine.createSpy("errorCallback");
    });

    describe("without fallback value", () => {
      beforeEach(() => {
        source$ = new Subject<number>();
        source$
          .pipe(catch404())
          .subscribe({ next: callback, error: errorCallback });
      });

      it("emits value if is not a 404 response", () => {
        source$.next(42);
        source$.complete();
        expect(callback).toHaveBeenCalledOnceWith(42);
        expect(errorCallback).not.toHaveBeenCalled();
      });

      it("emits error if is not a 404 response", () => {
        const error = new HttpErrorResponse({ status: 500 });
        source$.error(error);
        source$.complete();
        expect(callback).not.toHaveBeenCalled();
        expect(errorCallback).toHaveBeenCalledOnceWith(error);
      });

      it("catches error & emits null if is a 404 response", () => {
        const error = new HttpErrorResponse({ status: 404 });
        source$.error(error);
        source$.complete();
        expect(callback).toHaveBeenCalledOnceWith(null);
        expect(errorCallback).not.toHaveBeenCalled();
      });
    });

    describe("with fallback value", () => {
      beforeEach(() => {
        source$ = new Subject<number>();
        source$
          .pipe(catch404("fallback"))
          .subscribe({ next: callback, error: errorCallback });
      });

      it("emits value if is not a 404 response", () => {
        source$.next(42);
        source$.complete();
        expect(callback).toHaveBeenCalledOnceWith(42);
        expect(errorCallback).not.toHaveBeenCalled();
      });

      it("emits error if is not a 404 response", () => {
        const error = new HttpErrorResponse({ status: 500 });
        source$.error(error);
        source$.complete();
        expect(callback).not.toHaveBeenCalled();
        expect(errorCallback).toHaveBeenCalledOnceWith(error);
      });

      it("catches error & emits fallback value if is a 404 response", () => {
        const error = new HttpErrorResponse({ status: 404 });
        source$.error(error);
        source$.complete();
        expect(callback).toHaveBeenCalledOnceWith("fallback");
        expect(errorCallback).not.toHaveBeenCalled();
      });
    });
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

  describe("withReload", () => {
    it("emits values from `source$` and latest `source$` value when `reload$` emits", () => {
      const source$ = new Subject<number>();
      const reload$ = new Subject<void>();

      const result$ = withReload(source$, reload$);

      const callback = jasmine.createSpy("callback");
      result$.subscribe(callback);
      expect(callback).not.toHaveBeenCalled();

      source$.next(1);
      expect(callback).toHaveBeenCalledWith(1);
      expect(callback).toHaveBeenCalledTimes(1);

      callback.calls.reset();
      source$.next(2);
      expect(callback).toHaveBeenCalledWith(2);
      expect(callback).toHaveBeenCalledTimes(1);

      callback.calls.reset();
      reload$.next();
      expect(callback).toHaveBeenCalledWith(2);
      expect(callback).toHaveBeenCalledTimes(1);

      callback.calls.reset();
      source$.next(3);
      expect(callback).toHaveBeenCalledWith(3);
      expect(callback).toHaveBeenCalledTimes(1);

      callback.calls.reset();
      reload$.next();
      expect(callback).toHaveBeenCalledWith(3);
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });
});
