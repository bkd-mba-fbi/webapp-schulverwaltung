import { Settings } from "src/app/settings";
import { AdditionalInformationCode } from "../models/additional-informations.model";

export function isAllowedDossierCategory(
  category: AdditionalInformationCode,
  settings: Settings,
): boolean {
  return (
    category.IsActive &&
    // As a workaround, the type id of the category is in the `Sort`
    // field. Use this to exclude duplicate categories.
    category.Sort === String(settings.dossierCategoriesTypeId)
  );
}
