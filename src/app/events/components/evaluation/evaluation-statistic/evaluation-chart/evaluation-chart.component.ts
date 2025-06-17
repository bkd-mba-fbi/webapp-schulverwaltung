import { NgClass } from "@angular/common";
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  computed,
  inject,
  input,
  signal,
} from "@angular/core";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { EvaluationEntry } from "src/app/events/services/evaluation-state.service";
import { GradingScale } from "../../../../../shared/models/grading-scale.model";

@Component({
  selector: "bkd-evaluation-chart",
  templateUrl: "./evaluation-chart.component.html",
  styleUrl: "./evaluation-chart.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, TranslatePipe],
})
export class EvaluationChartComponent implements AfterViewInit, OnDestroy {
  entries = input.required<ReadonlyArray<EvaluationEntry>>();
  gradingScale = input.required<GradingScale>();

  private translate = inject(TranslateService);
  private resizeObserver: ResizeObserver | undefined;

  @ViewChild("chartWrapper", { static: false }) chartWrapper:
    | ElementRef<HTMLDivElement>
    | undefined;

  chartWidth = signal(600);
  minChartWidth = signal(300);
  chartHeight = signal(350);
  chartMargin = signal({ top: 5, right: 25, bottom: 25, left: 25 });
  minBarWidth = signal(20);
  maxBarWidth = signal(25);
  barPaddingFactor = signal(0.7); // factor determining how much space should be left between bars
  barCountForSmallerWidth = signal(25);
  currentChartWidth = signal(0);
  currentScrollWidth = signal(0);
  // Computed signal for the overflow class
  overflowClass = computed(() =>
    this.currentScrollWidth() > this.currentChartWidth()
      ? "is-overflowing"
      : "",
  );

  ngAfterViewInit(): void {
    const element = this.chartWrapper?.nativeElement;
    if (element) {
      this.currentChartWidth.set(Math.round(element.clientWidth));
      this.currentScrollWidth.set(Math.round(element.scrollWidth));

      this.resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          this.currentChartWidth.set(Math.round(entry.contentRect.width));
          this.currentScrollWidth.set(
            Math.round((entry.target as HTMLElement).scrollWidth),
          );
        }
      });

      this.resizeObserver.observe(element);
    }
  }
  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  // computed signals
  hasData = computed(() => this.chartData().length > 0);

  chartInnerWidth = computed(() => {
    const data = this.chartData();
    const numBars = data.length;

    if (numBars === 0) {
      return this.minChartWidth();
    }
    const calcChartWidth =
      numBars * (this.maxBarWidth() / this.barPaddingFactor());

    return Math.max(this.minChartWidth(), calcChartWidth);
  });

  chartInnerHeight = computed(
    () =>
      this.chartHeight() - this.chartMargin().top - this.chartMargin().bottom,
  );

  renderedChartWidth = computed(() => {
    return (
      this.chartInnerWidth() +
      this.chartMargin().left +
      this.chartMargin().right
    );
  });

  viewBox = computed(
    () => `0 0 ${this.renderedChartWidth()} ${this.chartHeight()}`,
  );

  bars = computed(() => {
    const data = this.chartData();
    const xScale = this.xScaleBar();
    const yScale = this.yScaleLinear();

    if (data.length === 0) return [];

    return data.map((d, index) => {
      const x = xScale.step * index + (xScale.step - xScale.barWidth) / 2;
      const y = this.scaleY(d.Count, yScale.domain, yScale.range);
      const height = this.chartInnerHeight() - y;
      const width = xScale.barWidth;
      const colorClass = d.Sufficient ? "bar-sufficient" : "bar-insufficient";

      return {
        x,
        y,
        width,
        height,
        colorClass,
        value: d.Value,
        count: d.Count,
      };
    });
  });

  xLabels = computed(() => {
    const data = this.chartData();
    const xScale = this.xScaleBar();
    const chartHeight = this.chartInnerHeight();

    if (data.length === 0) return [];

    const labels: {
      x: number;
      y: number;
      text: string;
      textAnchor: string;
    }[] = [];

    data.forEach((d, index) => {
      const x = xScale.step * index + xScale.step / 2;
      const y = chartHeight + 18;
      labels.push({
        x,
        y,
        text: d.Value.toString(),
        textAnchor: "middle",
      });
    });
    return labels;
  });

  barLabels = computed(() => {
    return this.bars().map((bar) => ({
      x: bar.x + bar.width / 2,
      y: bar.y - 5,
      text: bar.count.toString(),
    }));
  });

  legendLabels = computed(() => {
    const legendY = this.chartMargin().top / 2;

    const labels = [
      {
        text: this.translate.instant("evaluation.chart.unsufficient"),
        colorClass: "bar-insufficient",
        x: this.renderedChartWidth() / 2 - 80,
        y: legendY,
      },
      {
        text: this.translate.instant("evaluation.chart.sufficient"),
        colorClass: "bar-sufficient",
        x: this.renderedChartWidth() / 2 + 50,
        y: legendY,
      },
    ];
    return labels;
  });

  // Combined and processed data for the chart
  private chartData = computed(() => {
    const scale = this.gradingScale();

    if (!scale || scale.Grades.length === 0 || this.entries().length === 0) {
      return [];
    }

    const gradeCounts = this.countGrades();

    return scale.Grades.map((grade) => {
      return {
        Value: grade.Value,
        Count: gradeCounts.get(grade.Value) || 0,
        Sufficient: grade.Sufficient,
        Sort: grade.Sort || grade.Value.toString().padStart(2, "0"),
      };
    })
      .filter((d) => d.Value > 0)
      .filter((d) => d.Count > 0)
      .sort((a, b) => b.Sort.localeCompare(a.Sort));
  });

  private xScaleBar = computed(() => {
    if (this.chartData().length === 0)
      return {
        domain: [],
        range: [0, 0] as [number, number],
        step: 0,
        barWidth: 0,
      };

    const xDomain = this.chartData().map((d) => d.Value);
    const xRange = [0, this.chartInnerWidth()] as [number, number];

    const numBars = this.chartData().length;

    let barWidth = 0;
    let step = 0;

    // Berechnung der optimalen Bandbreite basierend auf dem verfügbaren Platz
    const calcBarWidth =
      (this.chartInnerWidth() / numBars) * this.barPaddingFactor();

    if (calcBarWidth > this.maxBarWidth()) {
      barWidth = this.maxBarWidth();
    } else if (numBars >= this.barCountForSmallerWidth()) {
      barWidth = this.minBarWidth();
    } else {
      barWidth = calcBarWidth;
    }

    step = this.chartInnerWidth() / numBars;
    return { domain: xDomain, range: xRange, step: step, barWidth: barWidth };
  });

  private yScaleLinear = computed(() => {
    if (this.chartData().length === 0)
      return {
        domain: [0, 0] as [number, number],
        range: [0, 0] as [number, number],
      };

    const maxCount = Math.max(...this.chartData().map((d) => d.Count), 0);
    const yDomain = [0, maxCount * 1.1] as [number, number];
    const yRange = [this.chartInnerHeight(), 0] as [number, number];
    return { domain: yDomain, range: yRange };
  });

  // Only count if a grade is present and has a valid Value
  private countGrades() {
    return this.entries().reduce((acc, { grade }) => {
      const gradeValue = grade?.Value;
      if (gradeValue == null) {
        return acc;
      }
      return acc.set(gradeValue, (acc.get(gradeValue) ?? 0) + 1);
    }, new Map<number, number>());
  }

  private scaleY(
    value: number,
    domain: [number, number],
    range: [number, number],
  ): number {
    const [domainMin, domainMax] = domain;
    const [rangeMin, rangeMax] = range;

    if (domainMax === domainMin) {
      return rangeMin;
    }

    return (
      rangeMin -
      ((value - domainMin) / (domainMax - domainMin)) * (rangeMin - rangeMax)
    );
  }
}
