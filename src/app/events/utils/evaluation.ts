import { UnreachableError } from "src/app/shared/utils/error";
import {
  EvaluationEntry,
  EvaluationSortCriteria,
} from "../services/evaluation-state.service";

export function evaluationEntryComparator(
  sortCriteria: EvaluationSortCriteria,
): (a: EvaluationEntry, b: EvaluationEntry) => number {
  return (a, b) => {
    let result = 0;
    switch (sortCriteria.primarySortKey) {
      case "name":
        result = compareByName(a, b);
        break;
      case "grade":
        result = compareByGrade(a, b);
        if (result === 0) {
          // Sort by name as second priority
          result = compareByName(a, b);
        }
        break;
      default:
        throw new UnreachableError(
          sortCriteria.primarySortKey,
          "Unhandled sort criteria",
        );
    }
    return sortCriteria.ascending ? result : -result;
  };
}

function compareByName(a: EvaluationEntry, b: EvaluationEntry): number {
  return a.gradingItem.PersonFullname.localeCompare(
    b.gradingItem.PersonFullname,
  );
}

function compareByGrade(a: EvaluationEntry, b: EvaluationEntry): number {
  return (a.grade?.Sort ?? "-").localeCompare(b.grade?.Sort ?? "-") * -1;
}
