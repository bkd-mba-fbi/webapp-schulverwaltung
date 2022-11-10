import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { buildSubscriptionDetail } from '../../../../spec-builders';
import { buildTestModuleMetadata } from '../../../../spec-helpers';

import {
  PresenceControlGroupDialogComponent,
  DialogMode,
} from './presence-control-group-dialog.component';

describe('PresenceControlGroupDialogComponent', () => {
  let component: PresenceControlGroupDialogComponent;
  let fixture: ComponentFixture<PresenceControlGroupDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [PresenceControlGroupDialogComponent],
        providers: [NgbActiveModal],
      })
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PresenceControlGroupDialogComponent);
    component = fixture.componentInstance;
    component.dialogMode = DialogMode.Select;
    component.subscriptionDetailsDefinitions = buildSubscriptionDetail(3843);
    component.group = null;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.title).toBe('presence-control.groups.select.title');
    expect(component.selected).toEqual({
      id: null,
      label: 'presence-control.groups.all',
    });
  });
});
