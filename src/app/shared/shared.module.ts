import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [],
  imports: [CommonModule, TranslateModule.forChild(), NgbModule],
  exports: [CommonModule, TranslateModule, NgbModule]
})
export class SharedModule {}
