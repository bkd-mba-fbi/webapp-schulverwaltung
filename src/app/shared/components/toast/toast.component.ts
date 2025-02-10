import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { NgbToast } from "@ng-bootstrap/ng-bootstrap";
import { ToastService } from "../../services/toast.service";

@Component({
  selector: "bkd-toast",
  templateUrl: "./toast.component.html",
  styleUrls: ["./toast.component.scss"],
  imports: [NgbToast, AsyncPipe],
})
export class ToastComponent {
  toastService = inject(ToastService);
}
