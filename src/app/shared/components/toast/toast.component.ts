import { Component } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'erz-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}

  getIcon(toast: any): string {
    switch (toast.type) {
      case 'error':
        return 'cancel';
      case 'warning':
        return 'help';
      case 'success':
      default:
        return 'check_circle';
    }
  }
}
