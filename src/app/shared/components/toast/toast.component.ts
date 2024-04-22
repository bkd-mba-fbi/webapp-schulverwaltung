import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import { Component } from "@angular/core";
import { NgbToast } from "@ng-bootstrap/ng-bootstrap";
import { ToastService } from "../../services/toast.service";

@Component({
  selector: "bkd-toast",
  templateUrl: "./toast.component.html",
  styleUrls: ["./toast.component.scss"],
  standalone: true,
  imports: [NgFor, NgbToast, NgIf, AsyncPipe],
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}
