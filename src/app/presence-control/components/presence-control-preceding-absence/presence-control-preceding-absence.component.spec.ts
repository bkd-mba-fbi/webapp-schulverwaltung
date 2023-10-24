import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresenceControlPrecedingAbsenceComponent } from './presence-control-preceding-absence.component';
import { buildTestModuleMetadata } from '../../../../spec-helpers';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('PresenceControlPreviousAbsenceComponent', () => {
  let component: PresenceControlPrecedingAbsenceComponent;
  let fixture: ComponentFixture<PresenceControlPrecedingAbsenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [PresenceControlPrecedingAbsenceComponent],
        providers: [NgbActiveModal],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PresenceControlPrecedingAbsenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
