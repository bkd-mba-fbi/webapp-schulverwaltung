import { GroupViewType } from '../models/user-setting.model';
import { updateGroupViews } from './user-settings';

describe('user settings', () => {
  describe('.updateGroupViews', () => {
    let groupViews: ReadonlyArray<GroupViewType>;
    let groupView: GroupViewType;

    it('adds new group view to empty settings', () => {
      groupViews = [];
      groupView = { lessonId: '1', group: 'A' };

      const updated = updateGroupViews(groupView, groupViews);

      expect(updated).toEqual([{ lessonId: '1', group: 'A' }]);
    });

    it('add new group view to existing settings for other lesson', () => {
      groupViews = [{ lessonId: '1', group: 'A' }];
      groupView = { lessonId: '2', group: 'B' };

      const updated = updateGroupViews(groupView, groupViews);

      expect(updated).toEqual([
        { lessonId: '1', group: 'A' },
        { lessonId: '2', group: 'B' },
      ]);
    });

    it('replaces group setting for existing lesson', () => {
      groupViews = [{ lessonId: '1', group: 'A' }];
      groupView = { lessonId: '1', group: 'B' };

      const updated = updateGroupViews(groupView, groupViews);

      expect(updated).toEqual([{ lessonId: '1', group: 'B' }]);
    });

    it('does not add null group to settings', () => {
      groupViews = [];
      groupView = { lessonId: '1', group: null };

      const updated = updateGroupViews(groupView, groupViews);

      expect(updated).toEqual([]);
    });

    it('does not add duplicated settings', () => {
      groupViews = [{ lessonId: '1', group: 'C' }];
      groupView = { lessonId: '1', group: 'C' };

      const updated = updateGroupViews(groupView, groupViews);

      expect(updated).toEqual([{ lessonId: '1', group: 'C' }]);
    });
  });
});
