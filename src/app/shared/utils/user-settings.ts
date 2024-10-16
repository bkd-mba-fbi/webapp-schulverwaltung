import { GroupOption } from "../../presence-control/components/presence-control-group-dialog/presence-control-group-dialog.component";
import { PresenceControlGroupViewEntry } from "../models/user-settings.model";

export function updateGroupViewSettings(
  group: GroupOption["id"],
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
