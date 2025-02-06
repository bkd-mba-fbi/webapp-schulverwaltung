import { Routes } from "@angular/router";
import { ImportSubscriptionDetailsUploadComponent } from "./components/import-subscription-details-upload/import-subscription-details-upload.component";
import { ImportSubscriptionDetailsComponent } from "./components/import-subscription-details/import-subscription-details.component";

export const IMPORT_SUBSCRIPTION_DETAILS_ROUTES: Routes = [
  {
    path: "",
    component: ImportSubscriptionDetailsComponent,
    children: [
      { path: "", component: ImportSubscriptionDetailsUploadComponent },
    ],
  },
];
