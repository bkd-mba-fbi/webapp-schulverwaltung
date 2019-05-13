import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresenceControlListComponent } from './presence-control-list.component';
import { PresenceControlHeaderComponent } from '../presence-control-header/presence-control-header.component';
import { buildTestModuleMetadata } from 'src/spec-helpers';

describe('PresenceControlListComponent', () => {
  let component: PresenceControlListComponent;
  let fixture: ComponentFixture<PresenceControlListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [
          PresenceControlListComponent,
          PresenceControlHeaderComponent
        ]
      })
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresenceControlListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
