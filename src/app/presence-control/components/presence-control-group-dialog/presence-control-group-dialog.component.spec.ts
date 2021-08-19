import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { buildSubscriptionDetail } from '../../../../spec-builders';
import { buildTestModuleMetadata } from '../../../../spec-helpers';

import { PresenceControlGroupDialogComponent } from './presence-control-group-dialog.component';

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
    component.title = 'title';
    component.emptyLabel = 'empty';
    component.subscriptionDetail = buildSubscriptionDetail(3843);
    component.savedGroupView = { lessonId: '1', group: null };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
