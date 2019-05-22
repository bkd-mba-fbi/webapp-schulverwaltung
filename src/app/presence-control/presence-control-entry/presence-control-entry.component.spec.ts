import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresenceControlEntryComponent } from './presence-control-entry.component';

describe('PresenceControlEntryComponent', () => {
  let component: PresenceControlEntryComponent;
  let fixture: ComponentFixture<PresenceControlEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PresenceControlEntryComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresenceControlEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
