import { Injectable } from '@angular/core';

export interface ToastInfo {
  message: string;
  type: 'success' | 'error' | 'warning';
  delay?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: ToastInfo[] = [];

  constructor() {}

  success(message: string) {
    this.toasts.push({ message, type: 'success' });
  }

  remove(toast: ToastInfo) {
    this.toasts = this.toasts.filter((t) => t != toast);
  }
}
