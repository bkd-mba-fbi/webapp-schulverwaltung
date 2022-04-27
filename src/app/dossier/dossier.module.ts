import { NgModule } from '@angular/core';
import { DossierComponent } from './components/dossier/dossier.component';
import { SharedModule } from '../shared/shared.module';
import { DossierRoutingModule } from './dossier-routing.module';

@NgModule({
  declarations: [DossierComponent],
  imports: [SharedModule, DossierRoutingModule],
})
export class DossierModule {}
