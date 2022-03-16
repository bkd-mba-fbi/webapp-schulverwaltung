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
import { RestRoleInterceptor } from '../rest-role-interceptor';
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
import { ResettableInputComponent } from './components/resettable-input/resettable-input.component';
import { SafePipe } from './pipes/safe.pipe';
import { XssPipe } from './pipes/xss.pipe';
import { AddSpacePipe } from './pipes/add-space.pipe';
import { MultiselectComponent } from './components/multiselect/multiselect.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { TestsWeightPipe } from './pipes/test-weight.pipe';
import { TestsGradingTypePipe } from './pipes/test-grading-type.pipe';

// Components that will be exported
const components = [
  LetDirective,
  SpinnerComponent,
  AvatarComponent,
  TypeaheadComponent,
  DateSelectComponent,
  SelectComponent,
  MultiselectComponent,
  StudentBacklinkComponent,
  StudentProfileComponent,
  StudentProfileEntryHeaderComponent,
  StudentProfileAddressComponent,
  StudentProfileLegalRepresentativeComponent,
  StudentProfileApprenticeshipCompanyComponent,
  StudentProfileAbsencesComponent,
  ConfirmAbsencesComponent,
  PersonEmailPipe,
  DaysDifferencePipe,
  SafePipe,
  XssPipe,
  AddSpacePipe,
  TestsWeightPipe,
  TestsGradingTypePipe,
];

@NgModule({
  declarations: [
    ...components,
    ResettableInputComponent,
    SafePipe,
    XssPipe,
    AddSpacePipe,
    MultiselectComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: RestErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: RestAuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: RestRoleInterceptor, multi: true },
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
    NgSelectModule,
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
    ResettableInputComponent,
    NgSelectModule,
  ],
})
export class SharedModule {}
