import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresenceControlCommentComponent } from './presence-control-comment.component';

describe('PresenceControlCommentComponent', () => {
  let component: PresenceControlCommentComponent;
  let fixture: ComponentFixture<PresenceControlCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PresenceControlCommentComponent]
    }).compileComponents();
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
