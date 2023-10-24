import { PresenceControlGroupViewEntry } from '../models/user-settings.model';
import { GroupOptions } from '../../presence-control/components/presence-control-group-dialog/presence-control-group-dialog.component';

export function updateGroupViewSettings(
  group: GroupOptions['id'],
  eventIds: ReadonlyArray<number>,
  existingSettings: ReadonlyArray<PresenceControlGroupViewEntry>,
): ReadonlyArray<PresenceControlGroupViewEntry> {
  const newSettings: ReadonlyArray<PresenceControlGroupViewEntry> =
    eventIds.map((eventId) => {
      return { eventId, group };
    });

  const updatedSettings = existingSettings.map(
    (es) => newSettings.find((ns) => ns.eventId === es.eventId) || es,
  );

  return [...new Set([...updatedSettings, ...newSettings])].filter(
    (settings) => settings.group !== null,
  );
}
