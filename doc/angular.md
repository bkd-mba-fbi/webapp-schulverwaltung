[back](../README.md)

# Angular Conventions

## General

- We use [standalone components](https://angular.dev/reference/migrations/standalone) and no Angular modules
- We use [control flow syntax](https://angular.dev/reference/migrations/control-flow)
- We use the [inject function](https://angular.dev/reference/migrations/inject-function) instead of constructor injection
- We use [signal inputs](https://angular.dev/reference/migrations/signal-inputs) instead of `@Input`
- We use the [output function](https://angular.dev/reference/migrations/outputs) instead of `@Output`
- We use the [model signal](https://angular.dev/api/core/model) for two-way input/output pairs (e.g. `name` input and `nameChange` output)
- We use [signal queries](https://angular.dev/reference/migrations/signal-queries) instead of `@ViewChild()`, `@ViewChildren`, `@ContentChild` and `@ContentChildren`
- We use [OnPush](https://angular.dev/best-practices/skipping-subtrees#using-onpush) instead of the `Default` change detection strategy
  - As a consequence, state has to be handled reactively, using signals (preferred) or observables (for more advanced async use cases) → see next section
  - When generating components with `ng generate component` the correct strategy will already be configured

## Reactivity

Previously the go-to tool for reactivity has been RxJS and observables. With Angular 17 a new reactive building block has been introduced: signals. With this change Angular is shifting towards signal-based APIs and patterns. But as of 2025 this is still "work in progress" and there are dos and don'ts to consider:

- For data fetching, we still use the observable-based `HttpClient` API for now, since with signals a pattern still has to emerge.
- In terms of the ergonomics it is desirable to work with signals in components/templates. They allow to always read the current value (also for `computed`s, no `value$.pipe(take(1)).subscribe(value => ...)`) and it is easy to define derived values with `computed(() => ...)`.
- Observables can be converted to signals using `toSignal`, but there are important things to note:
  - `toSignal` is not lazy, it subscribes to the observable (and causes the fetching of the data) no matter if the signal is read or not. The behavior can be compared to a "hot" observable.
  - This project includes a custom `toLazySignal` that only subscribes to the observable, when the signal is read.
  - Both `toSignal` and `toLazySignal` only unsubscribe when the injector is destroyed (i.e. the component is destroyed), they won't unsubscribe if the component stops using the signal due to a condition (`@if`) in the template.
  - Global services with `{ providedIn: "root" }` should not use `toSignal` and `toLazySignal`, since these observables will never get unsubscribed, unless a "hot" observable is the desired behavior.
  - Local services (provided in the context of a component or route) should always use `toLazySignal` when data fetching is involved.
  - Be aware, that converting signals created with `toLazySignal` back with `toObservable` will cause them to be not lazy anymore.
- `input` and `model` signals are preferred over `@Input` since they allow to integrate in the reactive world nicely (no more `Subject` that is `next`ed in `ngOnChanges`). And also, they allow to mark inputs as `input.required`.
- Function-based `output` is preferred over `@Output`.
