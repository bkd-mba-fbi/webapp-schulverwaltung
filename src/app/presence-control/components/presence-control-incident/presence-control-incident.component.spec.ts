import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresenceControlIncidentComponent } from './presence-control-incident.component';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('PresenceControlIncidentComponent', () => {
  let component: PresenceControlIncidentComponent;
  let fixture: ComponentFixture<PresenceControlIncidentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [PresenceControlIncidentComponent],
        providers: [NgbActiveModal],
      })
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresenceControlIncidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
