import { NgModule } from '@angular/core';

import { PersonSearchComponent } from './components/person-search/person-search.component';
import { PersonSearchRoutingModule } from './person-search-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [PersonSearchComponent],
  imports: [PersonSearchRoutingModule, SharedModule],
})
export class PersonSearchModule {}
