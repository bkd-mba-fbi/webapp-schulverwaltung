import { PresenceType } from '../models/presence-type.model';
import { DropDownItem } from '../models/drop-down-item.model';

/**
 * Sorts an array of presence types by the `Sort` attribute.
 */
export function sortPresenceTypes(
  presenceTypes: ReadonlyArray<PresenceType>
): ReadonlyArray<PresenceType> {
  return presenceTypes.slice().sort((a, b) => a.Sort - b.Sort);
}

/**
 * Creates an array of drop down items from an array of presence
 * types.
 */
export function createPresenceTypesDropdownItems(
  presenceTypes: ReadonlyArray<PresenceType>
): ReadonlyArray<DropDownItem> {
  return presenceTypes.map(presenceType => ({
    Key: presenceType.Id,
    Value: presenceType.Designation || ''
  }));
}
