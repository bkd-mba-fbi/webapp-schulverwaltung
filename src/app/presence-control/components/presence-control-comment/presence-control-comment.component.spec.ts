import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { PresenceControlCommentComponent } from './presence-control-comment.component';
import { PresenceControlBackComponent } from '../presence-control-back/presence-control-back.component';
import { PresenceControlStateService } from '../../services/presence-control-state.service';

describe('PresenceControlCommentComponent', () => {
  let component: PresenceControlCommentComponent;
  let fixture: ComponentFixture<PresenceControlCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [
          PresenceControlCommentComponent,
          PresenceControlBackComponent
        ],
        providers: [PresenceControlStateService]
      })
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresenceControlCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
