import { Injectable } from '@angular/core';

export interface ToastInfo {
  message: string;
  header?: string;
  classname?: string;
  icon: 'check_circle' | 'cancel' | 'help';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: ToastInfo[] = [];

  constructor() {}

  success(message: string, header?: string) {
    this.toasts.push({
      message,
      header,
      classname: 'bg-success text-light',
      icon: 'check_circle',
    });
  }

  error(message: string, header?: string) {
    this.toasts.push({
      message,
      header,
      classname: 'bg-danger text-light',
      icon: 'cancel',
    });
  }

  warning(message: string, header?: string) {
    this.toasts.push({
      message,
      header,
      classname: 'bg-warning',
      icon: 'help',
    });
  }

  remove(toast: ToastInfo) {
    this.toasts = this.toasts.filter((t) => t != toast);
  }
}
