/**
 * This directive is part of the ngrx-utils collection, see:
 * https://github.com/ngrx-utils/ngrx-utils/blob/master/libs/store/src/lib/directives/ngLet.ts
 *
 * Usage:
 *   <ng-container *bkdLet="(user$ | async) as task">
 *     {{ user.name }} {{ user.age }}
 *   </ng-container>
 *
 * Or with multiple observables:
 *   <ng-container *bkdLet="{ user: user$ | async, role: role$ | async }">
 *     {{ user.name }} {{ user.age }}: {{ role.name }}
 *   </ng-container>
 *
 * Checkout the following link for the full documentation:
 * https://github.com/ngrx-utils/ngrx-utils#nglet-directive
 *
 * License: MIT
 */
import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from "@angular/core";

export class LetContext {
  $implicit: unknown = null;
  bkdLet: unknown = null;
}

@Directive({
  selector: "[bkdLet]",
  standalone: true,
})
export class LetDirective implements OnInit {
  private context = new LetContext();

  @Input()
  set bkdLet(value: unknown) {
    this.context.$implicit = this.context.bkdLet = value;
  }

  constructor(
    private vcr: ViewContainerRef,
    private templateRef: TemplateRef<LetContext>,
  ) {}

  ngOnInit(): void {
    this.vcr.createEmbeddedView(this.templateRef, this.context);
  }
}
