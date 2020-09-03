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
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { RestAuthInterceptor } from '../rest-auth-interceptor';
import { RestErrorInterceptor } from '../rest-error-interceptor';
import { TypeaheadComponent } from './components/typeahead/typeahead.component';
import { DateSelectComponent } from './components/date-select/date-select.component';
import { SelectComponent } from './components/select/select.component';
import { StudentBacklinkComponent } from './components/student-backlink/student-backlink.component';
import { StudentProfileComponent } from './components/student-profile/student-profile.component';
import { StudentProfileEntryHeaderComponent } from './components/student-profile-entry-header/student-profile-entry-header.component';
import { StudentProfileAddressComponent } from './components/student-profile-address/student-profile-address.component';
import { StudentProfileLegalRepresentativeComponent } from './components/student-profile-legal-representative/student-profile-legal-representative.component';
import { StudentProfileApprenticeshipCompanyComponent } from './components/student-profile-apprenticeship-company/student-profile-apprenticeship-company.component';
import { StudentProfileAbsencesComponent } from './components/student-profile-absences/student-profile-absences.component';
import { ConfirmAbsencesComponent } from './components/confirm-absences/confirm-absences.component';
import { PersonEmailPipe } from './pipes/person-email.pipe';
import { DaysDifferencePipe } from './pipes/days-difference.pipe';

// Components that will be exported
const components = [
  LetDirective,
  SpinnerComponent,
  AvatarComponent,
  TypeaheadComponent,
  DateSelectComponent,
  SelectComponent,
  StudentBacklinkComponent,
  StudentProfileComponent,
  StudentProfileEntryHeaderComponent,
  StudentProfileAddressComponent,
  StudentProfileLegalRepresentativeComponent,
  ConfirmAbsencesComponent,
  PersonEmailPipe,
  DaysDifferencePipe,
];

// Components only used within the shared module
const internalComponents = [
  StudentProfileApprenticeshipCompanyComponent,
  StudentProfileAbsencesComponent,
];

@NgModule({
  declarations: [...components, internalComponents],
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
    InfiniteScrollModule,
    ...components,
  ],
})
export class SharedModule {}
