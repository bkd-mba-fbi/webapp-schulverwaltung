import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { PresenceControlDetailComponent } from './presence-control-detail.component';
import { PresenceControlBackComponent } from '../presence-control-back/presence-control-back.component';

describe('PresenceControlDetailComponent', () => {
  let component: PresenceControlDetailComponent;
  let fixture: ComponentFixture<PresenceControlDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [
          PresenceControlDetailComponent,
          PresenceControlBackComponent,
        ],
      })
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresenceControlDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
