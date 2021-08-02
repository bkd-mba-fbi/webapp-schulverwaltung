import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresenceControlGroupComponent } from './presence-control-group.component';
import { buildTestModuleMetadata } from '../../../../spec-helpers';
import { PresenceControlStateService } from '../../services/presence-control-state.service';

describe('PresenceControlGroupComponent', () => {
  let component: PresenceControlGroupComponent;
  let fixture: ComponentFixture<PresenceControlGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [PresenceControlGroupComponent],
        providers: [PresenceControlStateService],
      })
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PresenceControlGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
