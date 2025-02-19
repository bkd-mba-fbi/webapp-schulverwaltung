import { Routes } from "@angular/router";
import { ImportFileComponent } from "./components/import-file/import-file.component";
import { ImportSubscriptionDetailsUploadComponent } from "./components/import-subscription-details-upload/import-subscription-details-upload.component";
import { ImportSubscriptionDetailsValidationComponent } from "./components/import-subscription-details-validation/import-subscription-details-validation.component";
import { ImportComponent } from "./components/import/import.component";

export const IMPORT_ROUTES: Routes = [
  {
    path: "",
    component: ImportComponent,
    children: [
      { path: "", component: ImportFileComponent },
      { path: "list", component: ImportSubscriptionDetailsValidationComponent },
      {
        path: "upload",
        component: ImportSubscriptionDetailsUploadComponent,
      },
    ],
  },
];
