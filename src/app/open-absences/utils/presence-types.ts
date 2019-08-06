import { PresenceType } from 'src/app/shared/models/presence-type.model';

/**
 * Sorts an array of presence types by the `Sort` attribute.
 */
export function sortPresenceTypes(
  presenceTypes: ReadonlyArray<PresenceType>
): ReadonlyArray<PresenceType> {
  return presenceTypes.slice().sort((a, b) => a.Sort - b.Sort);
}
