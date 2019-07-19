import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresenceControlDialogComponent } from './presence-control-dialog.component';
import { buildTestModuleMetadata } from 'src/spec-helpers';

describe('PresenceControlDialogComponent', () => {
  let component: PresenceControlDialogComponent;
  let fixture: ComponentFixture<PresenceControlDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [PresenceControlDialogComponent]
      })
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresenceControlDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
