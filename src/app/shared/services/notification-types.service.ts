import { Inject, Injectable } from "@angular/core";
import { uniq } from "lodash-es";

import { NotificationTypeText, Settings, SETTINGS } from "src/app/settings";
import { getRoles } from "../utils/roles";
import { StorageService } from "./storage.service";

export interface NotificationType {
  key: string;
  text: NotificationTypeText;
}

@Injectable({
  providedIn: "root",
})
export class NotificationTypesService {
  private currentRoles: Option<ReadonlyArray<string>> = null;

  constructor(
    @Inject(SETTINGS) private settings: Settings,
    private storage: StorageService,
  ) {}

  getNotificationTypes(): ReadonlyArray<NotificationType> {
    return this.getNotificationTypeKeys().map((key) => {
      if (!(key in this.settings.notificationTypes)) {
        throw new Error(
          `Key '${key}' is missing in 'notificationTypes' setting`,
        );
      }

      return {
        key,
        text: this.settings.notificationTypes[key],
      };
    });
  }

  private getNotificationTypeKeys(): ReadonlyArray<string> {
    return uniq(
      this.settings.notificationTypesAssignments.reduce(
        (acc, { roles, types }) =>
          this.hasAnyRole(roles) ? [...acc, ...types] : acc,
        [] as ReadonlyArray<string>,
      ),
    );
  }

  private hasAnyRole(roles: ReadonlyArray<string>): boolean {
    if (this.currentRoles === null) {
      this.currentRoles = getRoles(this.storage.getPayload()?.roles);
    }
    return this.currentRoles.some((role) => roles.includes(role));
  }
}
