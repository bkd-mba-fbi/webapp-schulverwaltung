import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { AvatarComponent } from './components/avatar/avatar.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { LetDirective } from './directives/let.directive';

const components = [LetDirective, SpinnerComponent, AvatarComponent];

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    TranslateModule.forChild(),
    NgbModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    TranslateModule,
    NgbModule,
    ...components
  ]
})
export class SharedModule {}
