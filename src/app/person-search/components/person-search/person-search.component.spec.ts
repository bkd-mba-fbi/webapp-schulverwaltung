import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonSearchComponent } from './person-search.component';
import { RouterModule } from '@angular/router';

describe('SearchPersonComponent', () => {
  let component: PersonSearchComponent;
  let fixture: ComponentFixture<PersonSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonSearchComponent],
      imports: [RouterModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
