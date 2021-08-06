import { Settings } from '../../settings';
import { LessonPresence } from '../../shared/models/lesson-presence.model';
import { SubscriptionDetail } from '../../shared/models/subscription-detail.model';
import { SortCriteria } from '../components/presence-control-group/presence-control-group.component';

export type SubscriptionDetailWithName = {
  id: number;
  name: string;
  detail: SubscriptionDetail;
};

export function sortSubscriptionDetails(
  details: ReadonlyArray<SubscriptionDetailWithName>,
  sortCriteria: SortCriteria
): ReadonlyArray<SubscriptionDetailWithName> {
  return [...details].sort(getSubscriptionDetailComparator(sortCriteria));
}

function getSubscriptionDetailComparator(
  sortCriteria: SortCriteria
): (a: SubscriptionDetailWithName, b: SubscriptionDetailWithName) => number {
  return (a, b) => {
    const nameComparator = a.name.localeCompare(b.name);
    switch (sortCriteria.primarySortKey) {
      case 'name':
        return sortCriteria.ascending ? nameComparator * -1 : nameComparator;
      case 'group':
        const groupComparator = (a.detail.Value || '').localeCompare(
          b.detail.Value || ''
        );
        return sortCriteria.ascending
          ? (nameComparator + groupComparator) * -1
          : nameComparator + groupComparator;
    }
  };
}

export function getSubscriptionDetailsWithName(
  details: ReadonlyArray<SubscriptionDetail>,
  presences: ReadonlyArray<LessonPresence>
): ReadonlyArray<SubscriptionDetailWithName> {
  return details.map((d) => mapToSubscriptionDetailWithName(d, presences));
}

function mapToSubscriptionDetailWithName(
  detail: SubscriptionDetail,
  presences: ReadonlyArray<LessonPresence>
): SubscriptionDetailWithName {
  return {
    id: detail.IdPerson,
    name:
      presences.find((p) => p.StudentRef.Id === detail.IdPerson)
        ?.StudentFullName || '',
    detail,
  };
}

export function flattenSubscriptionDetails(
  details: ReadonlyArray<ReadonlyArray<SubscriptionDetail>>
): ReadonlyArray<SubscriptionDetail> {
  return ([] as SubscriptionDetail[]).concat(...(details || []));
}

export function filterSubscriptionDetailsByGroupId(
  details: ReadonlyArray<SubscriptionDetail>,
  settings: Settings
): ReadonlyArray<SubscriptionDetail> {
  return details.filter((d) => d.VssId === settings.subscriptionDetailGroupId);
}

export function findSubscriptionDetailByGroupId(
  details: ReadonlyArray<SubscriptionDetail>,
  settings: Settings
): Maybe<SubscriptionDetail> {
  return details.find((d) => d.VssId === settings.subscriptionDetailGroupId);
}
