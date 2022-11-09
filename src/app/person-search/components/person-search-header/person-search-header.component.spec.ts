import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonSearchHeaderComponent } from './person-search-header.component';

describe('PersonSearchHeaderComponent', () => {
  let component: PersonSearchHeaderComponent;
  let fixture: ComponentFixture<PersonSearchHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonSearchHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonSearchHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
