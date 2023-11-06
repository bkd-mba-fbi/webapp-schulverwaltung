import { Injectable } from "@angular/core";
import { SelectionService } from "src/app/shared/services/selection.service";
import { SubscriptionDetailWithName } from "../utils/subscriptions-details";

@Injectable()
export class PresenceControlGroupSelectionService extends SelectionService<SubscriptionDetailWithName> {}
