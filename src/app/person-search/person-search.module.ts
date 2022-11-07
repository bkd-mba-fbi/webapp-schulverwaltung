import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonSearchComponent } from './components/person-search/person-search.component';
import { PersonSearchRoutingModule } from './person-search-routing.module';

@NgModule({
  declarations: [PersonSearchComponent],
  imports: [CommonModule, PersonSearchRoutingModule],
})
export class PersonSearchModule {}
