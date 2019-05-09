import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { PresenceControlComponent } from './presence-control.component';
import { PresenceControlHeaderComponent } from './presence-control-header/presence-control-header.component';

describe('PresenceControlComponent', () => {
  let component: PresenceControlComponent;
  let fixture: ComponentFixture<PresenceControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [PresenceControlComponent, PresenceControlHeaderComponent]
      })
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresenceControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
