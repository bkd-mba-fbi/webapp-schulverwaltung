import { ComponentFixture, TestBed } from '@angular/core/testing';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { expectText } from 'src/specs/expectations';

import { DossierSectionLinkComponent } from './dossier-section-link.component';

describe('DossierSectionLinkComponent', () => {
  let component: DossierSectionLinkComponent;
  let fixture: ComponentFixture<DossierSectionLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [DossierSectionLinkComponent],
      })
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DossierSectionLinkComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a section link with translatable name', () => {
    // given
    component.name = 'dossier.name';
    fixture.detectChanges();

    // then
    expectText(fixture.debugElement, 'dossier-section-title', 'dossier.name');
  });
});
