import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyGradesShowComponent } from './my-grades-show.component';

describe('MyGradesShowComponent', () => {
  let component: MyGradesShowComponent;
  let fixture: ComponentFixture<MyGradesShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyGradesShowComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyGradesShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
