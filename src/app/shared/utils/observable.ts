import { HttpErrorResponse } from '@angular/common/http';
import {
  ObservableInput,
  ObservedValueOf,
  of,
  OperatorFunction,
  throwError
} from 'rxjs';
import { catchError } from 'rxjs/operators';

export function catch404AsNull<
  T,
  O extends ObservableInput<any>
>(): OperatorFunction<T, Option<T | ObservedValueOf<O>>> {
  return catchError(error => {
    if (error instanceof HttpErrorResponse && error.status === 404) {
      return of(null);
    } else {
      return throwError(error);
    }
  });
}
