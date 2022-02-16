import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsHeaderComponent } from './tests-header.component';

describe('TestsHeaderComponent', () => {
  let component: TestsHeaderComponent;
  let fixture: ComponentFixture<TestsHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestsHeaderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
