import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { EventsStateService } from '../../services/events-state.service';

import { EventsListComponent } from './events-list.component';
import { buildEvent } from '../../../../spec-builders';

describe('EventsListComponent', () => {
  let component: EventsListComponent;
  let fixture: ComponentFixture<EventsListComponent>;
  let stateServiceMock: EventsStateService;
  let element: HTMLElement;

  beforeEach(waitForAsync(() => {
    stateServiceMock = {
      loading$: of(false),
      events$: of([buildEvent(1)]),
      filteredEvents$: of([buildEvent(1)]),
    } as unknown as EventsStateService;

    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [EventsListComponent],
        providers: [
          { provide: EventsStateService, useValue: stateServiceMock },
        ],
      }),
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsListComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show the ratings column', () => {
    component.withRatings = false;

    fixture.detectChanges();
    expect(element.textContent).not.toContain('events.rating');
  });

  it('should show the ratings column', () => {
    component.withRatings = true;

    fixture.detectChanges();
    expect(element.textContent).toContain('events.rating');
  });
});
