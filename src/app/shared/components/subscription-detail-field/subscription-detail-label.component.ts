import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
} from "@angular/core";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { SubscriptionDetail } from "src/app/shared/models/subscription.model";

@Component({
  selector: "bkd-subscription-detail-label",
  imports: [NgbTooltipModule],
  template: `
    @if (!hideLabel()) {
      <label
        [attr.for]="id()"
        class="form-label"
        [class.horizontal]="layout() === 'horizontal'"
        [ngbTooltip]="detail().Tooltip ?? ''"
      >
        {{ detail().VssDesignation }}
        {{ required() ? "*" : "" }}
      </label>
    }
  `,
  styles: `
    :host {
      display: block;
    }

    @media (min-width: 811px) {
      .form-label.horizontal {
        padding-top: 0.25rem;
        padding-bottom: 0.25rem;
        margin-bottom: 0;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionDetailLabelComponent {
  readonly detail = model.required<SubscriptionDetail>();
  readonly id = input.required<string>();
  readonly hideLabel = input.required<boolean>();
  readonly layout = input.required<"vertical" | "horizontal">();

  protected readonly required = computed(
    () => this.detail().VssInternet === "M",
  );
}
