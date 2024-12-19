[back](../README.md)

# Reactivity

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
