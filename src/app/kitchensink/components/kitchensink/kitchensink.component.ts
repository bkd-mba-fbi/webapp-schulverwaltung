import { JsonPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  WritableSignal,
  signal,
} from "@angular/core";
import {
  SubscriptionDetail,
  SubscriptionDetailType,
} from "src/app/shared/models/subscription.model";
import { SubscriptionDetailFieldComponent } from "../../../shared/components/subscription-detail-field/subscription-detail-field.component";

@Component({
  selector: "bkd-kitchensink",
  imports: [JsonPipe, SubscriptionDetailFieldComponent],
  templateUrl: "./kitchensink.component.html",
  styleUrl: "./kitchensink.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KitchensinkComponent {
  subscriptionDetails: ReadonlyArray<Partial<SubscriptionDetail>> = [
    {
      VssDesignation: "Heading",
      VssStyle: "HE",
    },
    {
      VssDesignation: "Description",
      VssStyle: "BE",
      Value:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
    {
      VssDesignation: "Text field",
      VssTypeId: SubscriptionDetailType.ShortText,
      VssStyle: "TX",
      Value: "Lorem ipsum",
    },
    {
      VssDesignation: "Integer field",
      VssTypeId: SubscriptionDetailType.Int,
      VssStyle: "TX",
      Value: 42,
    },
    {
      VssDesignation: "Currency field",
      VssStyle: "TX",
      VssTypeId: SubscriptionDetailType.Currency,
      Value: "12.30",
    },
    {
      VssDesignation: "Textarea",
      VssTypeId: SubscriptionDetailType.Text,
      VssStyle: "TX",
      Value: "Lorem ipsum\ndolor sit amet",
    },
    {
      VssDesignation: "Date field",
      VssStyle: "TX",
      VssTypeId: SubscriptionDetailType.Date,
      Value: "23.01.2000",
    },
    {
      VssDesignation: "Yes/no checkbox",
      VssStyle: "TX",
      VssTypeId: SubscriptionDetailType.YesNo,
      ShowAsRadioButtons: false,
      Value: "Nein",
    },
    {
      VssDesignation: "Yes/no radios",
      VssStyle: "TX",
      VssTypeId: SubscriptionDetailType.YesNo,
      ShowAsRadioButtons: true,
      Value: "Nein",
    },
    {
      VssDesignation: "Yes checkbox",
      VssStyle: "TX",
      VssTypeId: SubscriptionDetailType.Yes,
      Value: "Ja",
    },
    {
      VssDesignation: "Listbox select",
      VssStyle: "LB",
      DropdownItems: [
        { Key: 1, Value: "Apple", IsActive: true },
        { Key: 2, Value: "Pear", IsActive: true },
        { Key: 3, Value: "Banana", IsActive: false },
      ],
      ShowAsRadioButtons: false,
      Value: "2",
    },
    {
      VssDesignation: "Listbox radios",
      VssStyle: "LB",
      DropdownItems: [
        { Key: 1, Value: "Apple", IsActive: true },
        { Key: 2, Value: "Pear", IsActive: true },
        { Key: 3, Value: "Banana", IsActive: false },
      ],
      ShowAsRadioButtons: true,
      Value: "2",
    },
    {
      VssDesignation: "Listbox many radios",
      VssStyle: "LB",
      DropdownItems: [
        { Key: 1, Value: "Apple", IsActive: true },
        { Key: 2, Value: "Cherry", IsActive: true },
        { Key: 3, Value: "Grape", IsActive: true },
        { Key: 4, Value: "Mango", IsActive: true },
        { Key: 5, Value: "Pear", IsActive: true },
        { Key: 6, Value: "Strawberry", IsActive: true },
      ],
      ShowAsRadioButtons: true,
      Value: "2",
    },
    {
      VssDesignation: "Combobox",
      VssStyle: "CB",
      DropdownItems: [
        { Key: "Apple", Value: "Apple", IsActive: true },
        { Key: "Banana", Value: "Banana", IsActive: false },
        { Key: "Grape", Value: "Grape", IsActive: true },
        { Key: "Grapefruit", Value: "Grapefruit", IsActive: true },
        { Key: "Pear", Value: "Pear", IsActive: true },
      ],
      Value: "Strawberry",
    },
  ].map((detail, i) => ({
    ...detail,
    Id: String(i + 1),
  }));
  subscriptionDetailsValues = this.getSubscriptionDetailValueSignals();

  subscriptionDetailsReadonly = this.subscriptionDetails.map((detail) => ({
    ...detail,
    VssInternet: "R",
  }));

  subscriptionDetailsRequired = this.subscriptionDetails.map((detail) => ({
    ...detail,
    VssInternet: "M",
  }));

  build(detail: Partial<SubscriptionDetail>): SubscriptionDetail {
    return {
      Id: "1",
      SubscriptionId: 1,
      VssId: 1,
      EventId: 1,
      IdPerson: 1,
      DropdownItems: [],
      ShowAsRadioButtons: false,
      VssType: "",
      VssTypeId: SubscriptionDetailType.ShortText,
      VssStyle: "TX",
      VssInternet: "E",
      VssDesignation: "",
      Tooltip: detail.VssDesignation ? `${detail.VssDesignation} Tooltip` : "",
      Value: null,
      Sort: "",
      ...detail,
    };
  }

  private getSubscriptionDetailValueSignals(): Dict<
    WritableSignal<SubscriptionDetail["Value"]>
  > {
    return this.subscriptionDetails.reduce(
      (acc, detail) => ({
        ...acc,
        [detail.Id ?? ""]: signal(detail.Value ?? null),
      }),
      {} as Dict<WritableSignal<SubscriptionDetail["Value"]>>,
    );
  }
}
