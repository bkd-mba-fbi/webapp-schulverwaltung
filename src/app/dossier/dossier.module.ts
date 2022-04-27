import { NgModule } from '@angular/core';
import { DossierComponent } from './components/dossier/dossier.component';
import { SharedModule } from '../shared/shared.module';
import { DossierRoutingModule } from './dossier-routing.module';
import { DossierOverviewComponent } from './components/dossier-overview/dossier-overview.component';
import { DossierSectionLinkComponent } from './components/dossier-section-link/dossier-section-link.component';

@NgModule({
  declarations: [
    DossierComponent,
    DossierOverviewComponent,
    DossierSectionLinkComponent,
  ],
  imports: [SharedModule, DossierRoutingModule],
})
export class DossierModule {}
