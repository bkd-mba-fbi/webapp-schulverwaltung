import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresenceControlDialogComponent } from './presence-control-dialog.component';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('PresenceControlDialogComponent', () => {
  let component: PresenceControlDialogComponent;
  let fixture: ComponentFixture<PresenceControlDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [PresenceControlDialogComponent],
        providers: [NgbActiveModal],
      })
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresenceControlDialogComponent);
    component = fixture.componentInstance;
    component.blockLessonPresences = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
