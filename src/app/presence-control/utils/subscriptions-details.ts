import { SortCriteria } from "src/app/shared/components/sortable-header/sortable-header.component";
import { Settings } from "../../settings";
import { LessonPresence } from "../../shared/models/lesson-presence.model";
import { SubscriptionDetail } from "../../shared/models/subscription.model";
import { UnreachableError } from "../../shared/utils/error";
import { SortKey } from "../components/presence-control-group/presence-control-group.component";

export interface SubscriptionDetailWithName {
  id: number;
  name: string;
  group: Option<string>;
  detail: SubscriptionDetail;
}

export function sortSubscriptionDetails(
  details: ReadonlyArray<SubscriptionDetailWithName>,
  sortCriteria: Option<SortCriteria<SortKey>>,
): ReadonlyArray<SubscriptionDetailWithName> {
  if (!sortCriteria) return details;
  return [...details].sort(getSubscriptionDetailComparator(sortCriteria));
}

function getSubscriptionDetailComparator(
  sortCriteria: SortCriteria<SortKey>,
): (a: SubscriptionDetailWithName, b: SubscriptionDetailWithName) => number {
  return (a, b) => {
    switch (sortCriteria.primarySortKey) {
      case "name": {
        const nameComparator = a.name.localeCompare(b.name);
        return sortCriteria.ascending ? nameComparator : nameComparator * -1;
      }
      case "group": {
        const valueA = a.detail.Value ? String(a.detail.Value) : "";
        const valueB = b.detail.Value ? String(b.detail.Value) : "";
        const groupComparator = valueA.localeCompare(valueB);
        return sortCriteria.ascending ? groupComparator : groupComparator * -1;
      }
      default:
        throw new UnreachableError(
          sortCriteria.primarySortKey,
          "Unhandled sort criteria",
        );
    }
  };
}

export function getSubscriptionDetailsWithName(
  details: ReadonlyArray<SubscriptionDetail>,
  presences: ReadonlyArray<LessonPresence>,
): ReadonlyArray<SubscriptionDetailWithName> {
  return details.map((d) => mapToSubscriptionDetailWithName(d, presences));
}

function mapToSubscriptionDetailWithName(
  detail: SubscriptionDetail,
  presences: ReadonlyArray<LessonPresence>,
): SubscriptionDetailWithName {
  return {
    id: detail.IdPerson,
    name:
      presences.find((p) => p.StudentRef.Id === detail.IdPerson)
        ?.StudentFullName || "",
    group: detail.Value ? String(detail.Value) : "",
    detail,
  };
}

export function filterSubscriptionDetailsByGroupId(
  details: ReadonlyArray<SubscriptionDetail>,
  settings: Settings,
): ReadonlyArray<SubscriptionDetail> {
  return details.filter((d) => d.VssId === settings.subscriptionDetailGroupId);
}

export function findSubscriptionDetailByGroupId(
  details: ReadonlyArray<SubscriptionDetail>,
  settings: Settings,
): Maybe<SubscriptionDetail> {
  return details.find((d) => d.VssId === settings.subscriptionDetailGroupId);
}
