import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbsenzenAuswertenComponent } from './absenzen-auswerten.component';

describe('AbsenzenAuswertenComponent', () => {
  let component: AbsenzenAuswertenComponent;
  let fixture: ComponentFixture<AbsenzenAuswertenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbsenzenAuswertenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbsenzenAuswertenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
