import { Routes } from "@angular/router";
import { ImportSubscriptionDetailsValidationComponent } from "./components/import-subscription-details-validation/import-subscription-details-validation.component";
import { ImportUploadComponent } from "./components/import-upload/import-upload.component";
import { ImportComponent } from "./components/import/import.component";

export const IMPORT_ROUTES: Routes = [
  {
    path: "",
    component: ImportComponent,
    children: [
      { path: "", component: ImportUploadComponent },
      { path: "list", component: ImportSubscriptionDetailsValidationComponent },
    ],
  },
];
