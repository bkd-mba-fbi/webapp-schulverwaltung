import { TestBed } from "@angular/core/testing";
import { Observable, Subject } from "rxjs";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { LoadingService } from "./loading-service";

describe("LoadingService", () => {
  let service: LoadingService;
  let loadingDefault: jasmine.Spy;
  let loadingCustom: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(LoadingService);

    loadingDefault = jasmine.createSpy("loadingDefault");
    service.loading().subscribe(loadingDefault);

    loadingCustom = jasmine.createSpy("loadingCustom");
    service.loading("custom").subscribe(loadingCustom);
  });

  it("tracks the loading states of two separate contexts", () => {
    expectCalledWith(loadingDefault, false);
    expectCalledWith(loadingCustom, false);

    // First observable in default context
    const [default$, nextDefault, completeDefault] = createObservable();
    const resultDefault = jasmine.createSpy("resultDefault");
    const resultDefault$ = service.load(default$);
    expectNotCalled(loadingDefault);
    expectNotCalled(loadingCustom);

    resultDefault$.subscribe(resultDefault);
    expectNotCalled(resultDefault);
    expectCalledWith(loadingDefault, true);
    expectNotCalled(loadingCustom);

    // Second observable in custom context
    const [custom$, nextCustom, completeCustom] = createObservable();
    const resultCustom = jasmine.createSpy("resultCustom");
    const resultCustom$ = service.load(custom$, "custom");
    expectNotCalled(loadingDefault);
    expectNotCalled(loadingCustom);

    resultCustom$.subscribe(resultCustom);
    expectNotCalled(resultCustom);
    expectNotCalled(loadingDefault);
    expectCalledWith(loadingCustom, true);

    // Both observables emit a value
    nextDefault(1);
    nextCustom(2);
    expectCalledWith(resultDefault, 1);
    expectCalledWith(resultCustom, 2);
    expectNotCalled(loadingDefault);
    expectNotCalled(loadingCustom);

    // Default observable completes
    completeDefault();
    expectCalledWith(loadingDefault, false);
    expectNotCalled(loadingCustom);

    // Custom observable completes
    completeCustom();
    expectNotCalled(loadingDefault);
    expectCalledWith(loadingCustom, false);
  });

  it("stops loading on first value with stopOnFirstValue=true", () => {
    expectCalledWith(loadingDefault, false);
    const [default$, nextDefault, completeDefault] = createObservable();
    const resultDefault = jasmine.createSpy("resultDefault");
    const resultDefault$ = service.load(default$, { stopOnFirstValue: true });
    expectNotCalled(loadingDefault);

    resultDefault$.subscribe(resultDefault);
    expectNotCalled(resultDefault);
    expectCalledWith(loadingDefault, true);

    nextDefault(1);
    expectCalledWith(loadingDefault, false);

    completeDefault();
    expectNotCalled(loadingDefault);
  });

  it("balances increments and decrements across multiple subscribers with stopOnFirstValue=true", () => {
    expectCalledWith(loadingDefault, false);

    // Hot source so both subscribers receive the same emission.
    const source$ = new Subject<number>();
    const result$ = service.load(source$, { stopOnFirstValue: true });

    const resultA = jasmine.createSpy("resultA");
    const resultB = jasmine.createSpy("resultB");
    result$.subscribe(resultA);
    result$.subscribe(resultB);
    expectCalledWith(loadingDefault, true);

    // Source emits a first value, reaching both subscribers.
    source$.next(1);

    // Both subscriptions have now decremented, so the loading state must
    // flip back to false.
    expectCalledWith(loadingDefault, false);
  });

  function createObservable(): [
    Observable<number>,
    (value: number) => void,
    () => void,
  ] {
    let next: (value: number) => void | undefined;
    let complete: () => void | undefined;

    const source$ = new Observable<number>((subscriber) => {
      next = (value: number) => subscriber.next(value);
      complete = () => subscriber.complete();
    });

    return [
      source$,
      (value: number) => next && next(value),
      () => complete && complete(),
    ];
  }

  function expectNotCalled(spy: jasmine.Spy): void {
    expect(spy).not.toHaveBeenCalled();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function expectCalledWith(spy: jasmine.Spy, args: any): void {
    expect(spy).toHaveBeenCalledWith(args);
    // expect(spy.calls.mostRecent().args).toEqual(args);
    spy.calls.reset();
  }
});
