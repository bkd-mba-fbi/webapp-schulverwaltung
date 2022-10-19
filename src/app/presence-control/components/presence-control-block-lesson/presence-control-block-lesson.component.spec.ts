import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PresenceControlBlockLessonComponent } from './presence-control-block-lesson.component';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('PresenceControlBlockLessonComponent', () => {
  let component: PresenceControlBlockLessonComponent;
  let fixture: ComponentFixture<PresenceControlBlockLessonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [PresenceControlBlockLessonComponent],
        providers: [NgbActiveModal],
      })
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresenceControlBlockLessonComponent);
    component = fixture.componentInstance;
    component.blockLessonPresences = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
