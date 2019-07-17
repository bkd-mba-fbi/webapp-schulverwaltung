import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { AvatarComponent } from './components/avatar/avatar.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { LetDirective } from './directives/let.directive';
import { NgxAutogrowModule } from 'ngx-autogrow';
import { RestAuthInterceptor } from '../rest-auth-interceptor';
import { RestErrorInterceptor } from '../rest-error-interceptor';

const components = [LetDirective, SpinnerComponent, AvatarComponent];

@NgModule({
  declarations: [...components],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: RestErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: RestAuthInterceptor, multi: true }
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    TranslateModule.forChild(),
    NgbModule,
    NgxAutogrowModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    TranslateModule,
    NgbModule,
    NgxAutogrowModule,
    ...components
  ]
})
export class SharedModule {}
