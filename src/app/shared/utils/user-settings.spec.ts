import { GroupViewType } from '../models/user-setting.model';
import { updateGroupViewSettings } from './user-settings';

describe('user settings', () => {
  describe('.updateGroupViewSettings', () => {
    let existingSettings: ReadonlyArray<GroupViewType>;

    it('adds new group view to empty settings', () => {
      existingSettings = [];

      const updated = updateGroupViewSettings('A', [1], existingSettings);

      expect(updated).toEqual([{ eventId: 1, group: 'A' }]);
    });

    it('add new group view to existing settings for other event - different group', () => {
      existingSettings = [{ eventId: 1, group: 'A' }];

      const updated = updateGroupViewSettings('B', [2], existingSettings);

      expect(updated).toEqual([
        { eventId: 1, group: 'A' },
        { eventId: 2, group: 'B' },
      ]);
    });

    it('add new group view to existing settings for other event - same group', () => {
      existingSettings = [{ eventId: 1, group: 'A' }];

      const updated = updateGroupViewSettings('A', [2], existingSettings);

      expect(updated).toEqual([
        { eventId: 1, group: 'A' },
        { eventId: 2, group: 'A' },
      ]);
    });

    it('replaces group setting for existing lesson', () => {
      existingSettings = [
        { eventId: 1, group: 'A' },
        { eventId: 2, group: 'A' },
        { eventId: 3, group: 'B' },
      ];

      const updated = updateGroupViewSettings('B', [1, 2], existingSettings);

      expect(updated).toEqual([
        { eventId: 1, group: 'B' },
        { eventId: 2, group: 'B' },
        { eventId: 3, group: 'B' },
      ]);
    });

    it('does not add null group to settings', () => {
      existingSettings = [];

      const updated = updateGroupViewSettings(null, [1], existingSettings);

      expect(updated).toEqual([]);
    });

    it('does remove existing setting if group is null', () => {
      existingSettings = [
        { eventId: 1, group: 'A' },
        { eventId: 2, group: 'A' },
      ];

      const updated = updateGroupViewSettings(null, [1], existingSettings);

      expect(updated).toEqual([{ eventId: 2, group: 'A' }]);
    });

    it('does not add duplicated settings', () => {
      existingSettings = [
        { eventId: 1, group: 'C' },
        { eventId: 2, group: 'B' },
      ];

      const updated = updateGroupViewSettings('C', [1], existingSettings);

      expect(updated).toEqual([
        { eventId: 1, group: 'C' },
        { eventId: 2, group: 'B' },
      ]);
    });
  });
});
