import { NgModule } from '@angular/core';

import { PersonSearchComponent } from './components/person-search/person-search.component';
import { PersonSearchRoutingModule } from './person-search-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PersonSearchHeaderComponent } from './components/person-search-header/person-search-header.component';
import { ConfirmAbsencesSelectionService } from '../shared/services/confirm-absences-selection.service';

@NgModule({
  declarations: [PersonSearchComponent, PersonSearchHeaderComponent],
  providers: [ConfirmAbsencesSelectionService],
  imports: [PersonSearchRoutingModule, SharedModule],
})
export class PersonSearchModule {}
