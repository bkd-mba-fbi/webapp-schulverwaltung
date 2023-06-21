import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let element: HTMLElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [HomeComponent],
      })
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders a link for each section', () => {
    const links = getLinks();
    expect(links).toEqual([
      '/dashboard',
      '/presence-control',
      '/open-absences',
      '/edit-absences',
      '/evaluate-absences',
      '/events',
      '/person-search',
      '/my-absences',
      '/my-profile',
      '/my-grades',
      '/my-settings',
    ]);
  });

  function getLinks(): string[] {
    const anchors = Array.prototype.slice.call(element.querySelectorAll('a'));
    return anchors.map((l) => l.getAttribute('href'));
  }
});
