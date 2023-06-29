import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsTestsComponent } from './events-tests.component';
import { buildTestModuleMetadata } from '../../../../spec-helpers';

describe('EventsTestsComponent', () => {
  let component: EventsTestsComponent;
  let fixture: ComponentFixture<EventsTestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [EventsTestsComponent],
      })
    ).compileComponents();

    fixture = TestBed.createComponent(EventsTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
