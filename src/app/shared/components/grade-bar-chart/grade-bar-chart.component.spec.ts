import { ComponentFixture, TestBed } from "@angular/core/testing";
import { GradeBarChartComponent } from "./grade-bar-chart.component";

describe("GradeBarChartComponent", () => {
  let component: GradeBarChartComponent;
  let fixture: ComponentFixture<GradeBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradeBarChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GradeBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
