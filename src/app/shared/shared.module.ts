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
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { RestAuthInterceptor } from '../rest-auth-interceptor';
import { RestErrorInterceptor } from '../rest-error-interceptor';
import { TypeaheadComponent } from './components/typeahead/typeahead.component';
import { DateSelectComponent } from './components/date-select/date-select.component';
import { SelectComponent } from './components/select/select.component';
import { StudentBacklinkComponent } from './components/student-backlink/student-backlink.component';
import { StudentProfileComponent } from './components/student-profile/student-profile.component';
import { PersonEmailPipe } from './pipes/person-email.pipe';

const components = [
  LetDirective,
  SpinnerComponent,
  AvatarComponent,
  TypeaheadComponent,
  DateSelectComponent,
  SelectComponent,
  StudentBacklinkComponent,
  StudentProfileComponent,
  PersonEmailPipe,
];

@NgModule({
  declarations: [...components],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: RestErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: RestAuthInterceptor, multi: true },
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    TranslateModule.forChild(),
    NgbModule,
    NgxAutogrowModule,
    InfiniteScrollModule,
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
    InfiniteScrollModule,
    ...components,
  ],
})
export class SharedModule {}
