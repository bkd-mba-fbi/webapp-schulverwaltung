/**
 * This directive is part of the ngrx-utils collection, see:
 * https://github.com/ngrx-utils/ngrx-utils/blob/master/libs/store/src/lib/directives/ngLet.ts
 *
 * Usage:
 *   <ng-container *erzLet="(user$ | async) as task">
 *     {{ user.name }} {{ user.age }}
 *   </ng-container>
 *
 * Or with multiple observables:
 *   <ng-container *erzLet="{ user: user$ | async, role: role$ | async }">
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
  TemplateRef,
  ViewContainerRef,
  OnInit,
} from '@angular/core';

export class LetContext {
  $implicit: any = null;
  erzLet: any = null;
}

@Directive({
  selector: '[erzLet]',
})
export class LetDirective implements OnInit {
  private context = new LetContext();

  @Input()
  set erzLet(value: any) {
    this.context.$implicit = this.context.erzLet = value;
  }

  constructor(
    private vcr: ViewContainerRef,
    private templateRef: TemplateRef<LetContext>
  ) {}

  ngOnInit(): void {
    this.vcr.createEmbeddedView(this.templateRef, this.context);
  }
}
