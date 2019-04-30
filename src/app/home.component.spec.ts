import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [HomeComponent]
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
      '/presence-control',
      '/offene-absenzen',
      '/edit-absences',
      '/absenzen-auswerten'
    ]);
  });

  function getLinks(): string[] {
    const anchors = Array.prototype.slice.call(element.querySelectorAll('a'));
    return anchors.map(l => l.getAttribute('href'));
  }
});
