import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsCurrentComponent } from './events-current.component';
import { buildTestModuleMetadata } from '../../../../spec-helpers';

describe('EventsCurrentComponent', () => {
  let component: EventsCurrentComponent;
  let fixture: ComponentFixture<EventsCurrentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [EventsCurrentComponent],
      })
    ).compileComponents();

    fixture = TestBed.createComponent(EventsCurrentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
