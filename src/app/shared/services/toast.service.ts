import { Injectable } from '@angular/core';

export interface ToastInfo {
  message: string;
  type: 'success' | 'error' | 'warning';
  header?: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: ToastInfo[] = [];

  constructor() {}

  success(message: string, header?: string) {
    this.toasts.push({ message, header, type: 'success' });
  }

  error(message: string, header?: string) {
    this.toasts.push({ message, header, type: 'error' });
  }

  warning(message: string, header?: string) {
    this.toasts.push({ message, header, type: 'warning' });
  }

  remove(toast: ToastInfo) {
    this.toasts = this.toasts.filter((t) => t != toast);
  }
}
