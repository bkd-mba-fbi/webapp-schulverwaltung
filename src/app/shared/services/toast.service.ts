import { Injectable } from '@angular/core';
import { isEqual } from 'lodash-es';
import { BehaviorSubject, take } from 'rxjs';

export interface ToastInfo {
  message: string;
  header?: string;
  classname?: string;
  icon?: 'check_circle' | 'cancel' | 'help';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastsSubject = new BehaviorSubject<ReadonlyArray<ToastInfo>>([]);
  toasts$ = this.toastsSubject.asObservable();

  constructor() {}

  success(message: string, header?: string) {
    this.addUnique({
      message,
      header,
      classname: 'bg-success text-light',
      icon: 'check_circle',
    });
  }

  warning(message: string, header?: string) {
    this.addUnique({
      message,
      header,
      classname: 'bg-warning',
      icon: 'help',
    });
  }

  error(message: string, header?: string) {
    this.addUnique({
      message,
      header,
      classname: 'bg-danger text-light',
      icon: 'cancel',
    });
  }

  remove(toast: ToastInfo) {
    this.updateToasts((toasts) => toasts.filter((t) => !isEqual(t, toast)));
  }

  private addUnique(toast: ToastInfo): void {
    this.updateToasts((toasts) => {
      if (!this.exists(toasts, toast)) {
        return [...toasts, toast];
      }
    });
  }

  private exists(toasts: ReadonlyArray<ToastInfo>, toast: ToastInfo): boolean {
    return Boolean(
      toasts.find(
        (existingToast) =>
          existingToast.message === toast.message &&
          existingToast.header === toast.header,
      ),
    );
  }

  private updateToasts(
    update: (
      existingToasts: ReadonlyArray<ToastInfo>,
    ) => Array<ToastInfo> | undefined,
  ): void {
    this.toasts$.pipe(take(1)).subscribe((existingToasts) => {
      const newToasts = update(existingToasts);
      if (newToasts) {
        this.toastsSubject.next(newToasts);
      }
    });
  }
}
