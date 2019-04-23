import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbsenzenBearbeitenComponent } from './absenzen-bearbeiten.component';

describe('AbsenzenBearbeitenComponent', () => {
  let component: AbsenzenBearbeitenComponent;
  let fixture: ComponentFixture<AbsenzenBearbeitenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbsenzenBearbeitenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbsenzenBearbeitenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
