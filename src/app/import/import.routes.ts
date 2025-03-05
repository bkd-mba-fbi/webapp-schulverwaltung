import { Routes } from "@angular/router";
import { ImportFileComponent } from "./components/common/import-file/import-file.component";
import { ImportUploadComponent } from "./components/common/import-upload/import-upload.component";
import { ImportValidationComponent } from "./components/common/import-validation/import-validation.component";
import { ImportComponent } from "./components/common/import/import.component";

export const IMPORT_ROUTES: Routes = [
  {
    path: "",
    component: ImportComponent,
    children: [
      { path: "", component: ImportFileComponent },
      {
        path: "validation",
        component: ImportValidationComponent,
      },
      {
        path: "upload",
        component: ImportUploadComponent,
      },
    ],
  },
];
