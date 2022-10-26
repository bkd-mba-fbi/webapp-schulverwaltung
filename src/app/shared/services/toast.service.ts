import { Injectable } from '@angular/core';

interface ToastInfo {
  message: string;
  header?: string;
  classname?: string;
  icon?: 'check_circle' | 'cancel' | 'help';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: ToastInfo[] = [];

  constructor() {}

  success(message: string, header?: string) {
    this.addUnique({
      message,
      header,
      classname: 'bg-success text-light',
      icon: 'check_circle',
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

  warning(message: string, header?: string) {
    this.addUnique({
      message,
      header,
      classname: 'bg-warning',
      icon: 'help',
    });
  }

  remove(toast: ToastInfo) {
    this.toasts = this.toasts.filter((t) => t != toast);
  }

  private addUnique(toast: ToastInfo): void {
    if (!this.exists(toast)) {
      this.toasts.push(toast);
    }
  }

  private exists(toast: ToastInfo) {
    return this.toasts.find(
      (existingToast) =>
        existingToast.message === toast.message &&
        existingToast.header === toast.header
    );
  }
}
