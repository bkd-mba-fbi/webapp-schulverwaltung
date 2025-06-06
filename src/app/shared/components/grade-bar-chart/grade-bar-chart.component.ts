import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  computed,
  input,
  signal,
} from "@angular/core";
import { EvaluationEntry } from "src/app/events/services/evaluation-state.service";
import { GradingScale } from "../../models/grading-scale.model";

@Component({
  selector: "bkd-grade-bar-chart",
  templateUrl: "./grade-bar-chart.component.html",
  styleUrl: "./grade-bar-chart.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GradeBarChartComponent {
  entries = input.required<ReadonlyArray<EvaluationEntry>>();
  gradingScale = input.required<GradingScale>();

  chartWidth = signal(600);
  chartHeight = signal(400);
  chartMargin = signal({ top: 20, right: 20, bottom: 50, left: 20 }); // Now an InputSignal

  // Derived signals for dimensions
  chartInnerWidth = computed(
    () =>
      this.chartWidth() - this.chartMargin().left - this.chartMargin().right,
  );
  chartInnerHeight = computed(
    () =>
      this.chartHeight() - this.chartMargin().top - this.chartMargin().bottom,
  );
  viewBox = computed(() => `0 0 ${this.chartWidth()} ${this.chartHeight()}`);

  @HostBinding("style.display") display = "block";
  @HostBinding("style.width") hostWidth = "100%";
  @HostBinding("style.height") hostHeight = "100%";
  @HostBinding("style.overflow") overflow = "hidden";

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
        Count: gradeCounts.get(gradeFromScale.Value) || 0, // Get count from map, default to 0
        Sufficient: gradeFromScale.Sufficient,
        Sort:
          gradeFromScale.Sort ||
          gradeFromScale.Value.toString().padStart(2, "0"),
      };
    })
      .filter((d) => d.Value > 0) // Filter out grades with Value <= 0
      .sort((a, b) => b.Sort.localeCompare(a.Sort)); // Sort by the Sort property

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
    const xRange = [0, this.chartInnerWidth()] as [number, number]; // Depends on signal

    const numBars = xDomain.length;
    const bandWidth = (this.chartInnerWidth() / numBars) * 0.7;
    const step = this.chartInnerWidth() / numBars;

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
    const yRange = [this.chartInnerHeight(), 0] as [number, number]; // Depends on signal

    return { domain: yDomain, range: yRange };
  });

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
      }; // count hinzufügen
    });
  });

  xLabels = computed(() => {
    const data = this.processedChartData();
    const xScale = this.xScaleBand();
    const chartHeight = this.chartInnerHeight();

    if (data.length === 0) return [];

    const labels: {
      x: number;
      text: string;
      transform: string;
      textAnchor: string;
    }[] = [];
    const maxLabels = 51; // Maximale Anzahl der X-Achsen-Labels, die angezeigt werden sollen
    const totalDataPoints = data.length;

    // Bestimmen Sie, wie viele Labels wir überspringen müssen
    const stepInterval = Math.max(1, Math.ceil(totalDataPoints / maxLabels));

    data.forEach((d, index) => {
      // Nur jedes `stepInterval`-te Label anzeigen
      if (index % stepInterval === 0) {
        const x = xScale.step * index + xScale.step / 2;
        const y = chartHeight + 25; // Etwas mehr Platz nach unten für rotierte Labels
        const rotationAngle = -45; // Rotationswinkel in Grad
        labels.push({
          x,
          text: d.Value.toString(),
          transform: `rotate(${rotationAngle} ${x},${y})`, // Rotation um den Label-Mittelpunkt
          textAnchor: "end", // Text am Ende des Labels ausrichten (nach Rotation)
        });
      }
    });
    return labels;
  });

  barLabels = computed(() => {
    const barsData = this.bars(); // Nutze die bereits berechneten Balkendaten
    return barsData
      .filter((bar) => bar.count > 0) // Nur Labels für Balken mit Count > 0 anzeigen
      .map((bar) => ({
        x: bar.x + bar.width / 2, // Mitte des Balkens
        y: bar.y - 5, // 5 Pixel oberhalb des Balkens
        text: bar.count.toString(),
      }));
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
