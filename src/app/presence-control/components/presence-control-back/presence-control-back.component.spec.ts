import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresenceControlBackComponent } from './presence-control-back.component';

describe('PresenceControlBackComponent', () => {
  let component: PresenceControlBackComponent;
  let fixture: ComponentFixture<PresenceControlBackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PresenceControlBackComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresenceControlBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
