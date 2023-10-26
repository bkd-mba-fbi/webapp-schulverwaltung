import { PresenceType } from "../models/presence-type.model";
import { DropDownGroupedItem } from "../models/drop-down-grouped-item.model";
import { DropDownItem } from "../models/drop-down-item.model";

/**
 * Sorts an array of presence types by the `Sort` attribute.
 */
export function sortPresenceTypes(
  presenceTypes: ReadonlyArray<PresenceType>,
): ReadonlyArray<PresenceType> {
  return presenceTypes.slice().sort((a, b) => a.Sort - b.Sort);
}

/**
 * Creates an array of drop down items from an array of presence
 * types.
 */
export function createPresenceTypesDropdownItems(
  presenceTypes: ReadonlyArray<PresenceType>,
): ReadonlyArray<DropDownItem> {
  return presenceTypes.map((presenceType) => ({
    Key: presenceType.Id,
    Value: presenceType.Designation || "",
  }));
}

/**
 * Adds an all group element to dropdown item
 */
export function addGroupToDropdownItem(
  items: ReadonlyArray<DropDownItem>,
  group: string,
): ReadonlyArray<DropDownGroupedItem> {
  return items.map((i) =>
    Object.assign(i, {
      Group: group,
    }),
  );
}
