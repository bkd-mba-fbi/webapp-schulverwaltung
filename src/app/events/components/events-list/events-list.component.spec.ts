import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { EventsStateService } from '../../services/events-state.service';

import { EventsListComponent } from './events-list.component';

describe('EventsListComponent', () => {
  let component: EventsListComponent;
  let fixture: ComponentFixture<EventsListComponent>;
  let stateServiceMock: EventsStateService;

  beforeEach(waitForAsync(() => {
    stateServiceMock = {
      loading$: of(false),
      events$: of([]),
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
