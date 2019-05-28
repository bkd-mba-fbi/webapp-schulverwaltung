import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LetDirective } from './directives/let.directive';
import { SpinnerComponent } from './components/spinner/spinner.component';

const components = [LetDirective, SpinnerComponent];

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    HttpClientModule,
    TranslateModule.forChild(),
    NgbModule
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    TranslateModule,
    NgbModule,
    ...components
  ]
})
export class SharedModule {}
