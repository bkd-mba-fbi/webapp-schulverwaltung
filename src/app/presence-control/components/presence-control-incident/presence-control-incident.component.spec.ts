import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PresenceControlIncidentComponent } from './presence-control-incident.component';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('PresenceControlIncidentComponent', () => {
  let component: PresenceControlIncidentComponent;
  let fixture: ComponentFixture<PresenceControlIncidentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [PresenceControlIncidentComponent],
        providers: [NgbActiveModal],
      }),
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresenceControlIncidentComponent);
    component = fixture.componentInstance;
    component.incidentTypes = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
