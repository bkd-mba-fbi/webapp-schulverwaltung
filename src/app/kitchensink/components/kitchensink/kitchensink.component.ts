import { ChangeDetectionStrategy, Component } from "@angular/core";
import {
  SubscriptionDetail,
  SubscriptionDetailType,
} from "src/app/shared/models/subscription.model";
import { SubscriptionDetailFieldComponent } from "../../../shared/components/subscription-detail-field/subscription-detail-field.component";

@Component({
  selector: "bkd-kitchensink",
  imports: [SubscriptionDetailFieldComponent],
  templateUrl: "./kitchensink.component.html",
  styleUrl: "./kitchensink.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KitchensinkComponent {
  subscriptionDetails: ReadonlyArray<SubscriptionDetail> = [
    build({
      VssDesignation: "Heading",
      Id: "1",
      VssStyle: "HE",
    }),
    build({
      VssDesignation: "Description",
      Id: "2",
      VssStyle: "BE",
      Value:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    }),
    build({
      VssDesignation: "Textfield",
      Id: "3",
      VssTypeId: SubscriptionDetailType.ShortText,
      VssStyle: "TX",
      Value: "Lorem ipsum",
    }),
    build({
      VssDesignation: "Textarea",
      Id: "4",
      VssTypeId: SubscriptionDetailType.Text,
      VssStyle: "TX",
      Value: "Lorem ipsum",
    }),
    build({
      VssDesignation: "Number field",
      Id: "5",
      VssTypeId: SubscriptionDetailType.Int,
      VssStyle: "TX",
      Value: 42,
    }),
    build({
      VssDesignation: "Listbox Select",
      Id: "6",
      VssStyle: "LB",
      DropdownItems: [
        { Key: 1, Value: "Apple", IsActive: true },
        { Key: 2, Value: "Pear", IsActive: true },
        { Key: 3, Value: "Banana", IsActive: false },
      ],
      ShowAsRadioButtons: false,
      Value: 2,
    }),
    build({
      VssDesignation: "Listbox Radios",
      Id: "7",
      VssStyle: "LB",
      DropdownItems: [
        { Key: 1, Value: "Apple", IsActive: true },
        { Key: 2, Value: "Pear", IsActive: true },
        { Key: 3, Value: "Banana", IsActive: false },
      ],
      ShowAsRadioButtons: true,
      Value: 2,
    }),
    build({
      VssDesignation: "Combobox",
      Id: "8",
      VssStyle: "CB",
      DropdownItems: [
        { Key: "Apple", Value: "Apple", IsActive: true },
        { Key: "Pear", Value: "Pear", IsActive: true },
        { Key: "Banana", Value: "Banana", IsActive: false },
      ],
      Value: "Strawberry",
    }),
  ];

  subscriptionDetailsReadonly = this.subscriptionDetails.map((detail) => ({
    ...detail,
    VssInternet: "R",
  }));

  subscriptionDetailsRequired = this.subscriptionDetails.map((detail) => ({
    ...detail,
    VssInternet: "M",
  }));
}

function build(detail: Partial<SubscriptionDetail>): SubscriptionDetail {
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
    Tooltip: "",
    Value: null,
    Sort: "",
    ...detail,
  };
}
