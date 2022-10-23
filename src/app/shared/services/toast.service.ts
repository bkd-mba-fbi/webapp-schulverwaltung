import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export interface ToastInfo {
  body: string;
  delay?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: ToastInfo[] = [];

  constructor(private translate: TranslateService) {}

  show(message: string) {
    const body = this.translate.instant(message);
    this.toasts.push({ body });
  }

  remove(toast: ToastInfo) {
    this.toasts = this.toasts.filter((t) => t != toast);
  }
}
