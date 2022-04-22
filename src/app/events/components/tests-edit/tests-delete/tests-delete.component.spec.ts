import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsDeleteComponent } from './tests-delete.component';

describe('TestsDeleteComponent', () => {
  let component: TestsDeleteComponent;
  let fixture: ComponentFixture<TestsDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestsDeleteComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestsDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
