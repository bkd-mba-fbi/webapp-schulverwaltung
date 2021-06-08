import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresenceControlGroupComponent } from './presence-control-group.component';

describe('PresenceControlGroupComponent', () => {
  let component: PresenceControlGroupComponent;
  let fixture: ComponentFixture<PresenceControlGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PresenceControlGroupComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PresenceControlGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
