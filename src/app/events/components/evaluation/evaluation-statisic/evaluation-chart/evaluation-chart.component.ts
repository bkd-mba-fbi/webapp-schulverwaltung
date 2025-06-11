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
  imports: [NgClass, TranslatePipe],
  templateUrl: "./evaluation-chart.component.html",
  styleUrl: "./evaluation-chart.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  get overflowClass() {
    return this.currentScrollWidth() - this.currentChartWidth() > 0
      ? "is-overflowing"
      : "";
  }

  actualChartInnerWidth = computed(() => {
    const data = this.processedChartData();
    const numBars = data.length;

    if (numBars === 0) {
      return this.minChartWidth();
    }
    const calcChartWidth =
      numBars * (this.maxBarWidth() / this.barPaddingFactor());

    return Math.max(this.minChartWidth(), calcChartWidth);
  });

  renderedChartWidth = computed(() => {
    return (
      this.actualChartInnerWidth() +
      this.chartMargin().left +
      this.chartMargin().right
    );
  });

  chartInnerHeight = computed(
    () =>
      this.chartHeight() - this.chartMargin().top - this.chartMargin().bottom,
  );
  viewBox = computed(
    () => `0 0 ${this.renderedChartWidth()} ${this.chartHeight()}`,
  );

  hasData = computed(() => this.processedChartData().length > 0);

  bars = computed(() => {
    const data = this.processedChartData();
    const xScale = this.xScaleBand();
    const yScale = this.yScaleLinear();
    const chartHeight = this.chartInnerHeight();

    if (data.length === 0) return [];

    return data.map((d, index) => {
      const x = xScale.step * index + (xScale.step - xScale.bandWidth) / 2;
      const y = this.scaleY(d.Count, yScale.domain, yScale.range);
      const height = chartHeight - y;
      const width = xScale.bandWidth;
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
    const data = this.processedChartData();
    const xScale = this.xScaleBand();
    const chartHeight = this.chartInnerHeight();

    if (data.length === 0) return [];

    const labels: {
      x: number;
      y: number;
      text: string;
      textAnchor: string;
    }[] = [];
    const maxLabels = 51;
    const totalDataPoints = data.length;

    const stepInterval = Math.max(1, Math.ceil(totalDataPoints / maxLabels));

    data.forEach((d, dataIndex) => {
      if (dataIndex % stepInterval === 0) {
        // Nur jedes n-te Label anzeigen von den gefilterten
        // Finde den ursprünglichen Index in den UNGEFILTERTEN Daten, um die X-Position zu bestimmen
        const originalIndex = data.findIndex((item) => item.Value === d.Value);
        if (originalIndex !== -1) {
          const x = xScale.step * originalIndex + xScale.step / 2;
          const y = chartHeight + 18;
          labels.push({
            x,
            y,
            text: d.Value.toString(),
            textAnchor: "middle",
          });
        }
      }
    });
    return labels;
  });

  barLabels = computed(() => {
    const barsData = this.bars();
    return barsData.map((bar) => ({
      x: bar.x + bar.width / 2,
      y: bar.y - 5,
      text: bar.count.toString(),
    }));
  });

  legendLabels = computed(() => {
    const chartWidth = this.renderedChartWidth();
    const margin = this.chartMargin();
    const legendY = margin.top / 2;

    const labels = [
      {
        text: this.translate.instant("evaluation.chart.unsufficient"),
        colorClass: "bar-insufficient",
        x: chartWidth / 2 - 80,
        y: legendY,
      },
      {
        text: this.translate.instant("evaluation.chart.sufficient"),
        colorClass: "bar-sufficient",
        x: chartWidth / 2 + 50,
        y: legendY,
      },
    ];
    return labels;
  });

  ngAfterViewInit(): void {
    const element = this.chartWrapper?.nativeElement;
    if (element) {
      this.resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          this.currentChartWidth.set(Math.round(entry.contentRect.width));
          this.currentScrollWidth.set(Math.round(entry.target.scrollWidth));
        }
      });

      this.resizeObserver?.observe(element);

      this.currentChartWidth.set(Math.round(element.clientWidth));
      this.currentScrollWidth.set(Math.round(element.scrollWidth));
    }
  }
  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  // Combined and processed data for the chart
  private processedChartData = computed(() => {
    const scale = this.gradingScale();
    const gradeEntries = this.entries();

    if (!scale || scale.Grades.length === 0 || gradeEntries.length === 0) {
      return [];
    }

    const gradeCounts = new Map<number, number>();
    this.entries().forEach((entry) => {
      // Only count if a grade is present and has a valid Value
      if (entry.grade?.Value !== undefined && entry.grade.Value !== null) {
        const gradeValue = entry.grade.Value;
        gradeCounts.set(gradeValue, (gradeCounts.get(gradeValue) || 0) + 1);
      }
    });

    const combinedData: Array<{
      Value: number;
      Count: number;
      Sufficient: boolean;
      Sort: string;
    }> = scale.Grades.map((gradeFromScale) => {
      return {
        Value: gradeFromScale.Value,
        Count: gradeCounts.get(gradeFromScale.Value) || 0,
        Sufficient: gradeFromScale.Sufficient,
        Sort:
          gradeFromScale.Sort ||
          gradeFromScale.Value.toString().padStart(2, "0"),
      };
    })
      .filter((d) => d.Value > 0)
      .filter((d) => d.Count > 0)
      .sort((a, b) => b.Sort.localeCompare(a.Sort));

    return combinedData;
  });

  // Signals for scales
  private xScaleBand = computed(() => {
    const data = this.processedChartData();
    if (data.length === 0)
      return {
        domain: [],
        range: [0, 0] as [number, number],
        step: 0,
        bandWidth: 0,
      };

    const xDomain = data.map((d) => d.Value);
    const xRange = [0, this.actualChartInnerWidth()] as [number, number];

    const numBars = data.length;

    let bandWidth = 0;
    let step = 0;

    // Berechnung der optimalen Bandbreite basierend auf dem verfügbaren Platz
    const proportionalBandWidth =
      (this.actualChartInnerWidth() / numBars) * this.barPaddingFactor();

    if (proportionalBandWidth > this.maxBarWidth()) {
      bandWidth = this.maxBarWidth();
    } else if (numBars >= this.barCountForSmallerWidth()) {
      bandWidth = this.minBarWidth();
    } else {
      bandWidth = proportionalBandWidth;
    }

    step = this.actualChartInnerWidth() / numBars;
    return { domain: xDomain, range: xRange, step: step, bandWidth: bandWidth };
  });

  private yScaleLinear = computed(() => {
    const data = this.processedChartData();
    if (data.length === 0)
      return {
        domain: [0, 0] as [number, number],
        range: [0, 0] as [number, number],
      };

    const maxCount = Math.max(...data.map((d) => d.Count), 0);
    const yDomain = [0, maxCount * 1.1] as [number, number];
    const yRange = [this.chartInnerHeight(), 0] as [number, number];
    return { domain: yDomain, range: yRange };
  });

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
