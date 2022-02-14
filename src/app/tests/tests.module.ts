import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestsRoutingModule } from './tests-routing.module';
import { TestsComponent } from './components/tests/tests.component';

@NgModule({
  declarations: [TestsComponent],
  imports: [CommonModule, TestsRoutingModule],
})
export class TestsModule {}
