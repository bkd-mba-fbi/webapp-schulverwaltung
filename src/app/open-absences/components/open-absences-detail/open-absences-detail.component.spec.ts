import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenAbsencesDetailComponent } from './open-absences-detail.component';

describe('OpenAbsencesDetailComponent', () => {
  let component: OpenAbsencesDetailComponent;
  let fixture: ComponentFixture<OpenAbsencesDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OpenAbsencesDetailComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenAbsencesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
