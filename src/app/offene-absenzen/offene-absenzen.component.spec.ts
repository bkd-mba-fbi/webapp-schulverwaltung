import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OffeneAbsenzenComponent } from './offene-absenzen.component';

describe('OffeneAbsenzenComponent', () => {
  let component: OffeneAbsenzenComponent;
  let fixture: ComponentFixture<OffeneAbsenzenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OffeneAbsenzenComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffeneAbsenzenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
