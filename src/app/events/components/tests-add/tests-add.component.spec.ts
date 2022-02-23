import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsAddComponent } from './tests-add.component';

describe('TestsAddComponent', () => {
  let component: TestsAddComponent;
  let fixture: ComponentFixture<TestsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestsAddComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
