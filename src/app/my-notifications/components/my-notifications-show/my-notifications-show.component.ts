import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  interval,
  Observable,
  Subject,
  throwError,
} from 'rxjs';
import { catchError, switchMap, withLatestFrom } from 'rxjs/operators';
import { NotificationDataPropertyValueType } from 'src/app/shared/models/user-setting.model';
import { MyNotificationsService } from '../../services/my-notifications.service';
import { SETTINGS, Settings } from 'src/app/settings';

@Component({
  templateUrl: './my-notifications-show.component.html',
  styleUrls: ['./my-notifications-show.component.scss'],
})
export class MyNotificationsShowComponent {
  notifications$: Observable<ReadonlyArray<NotificationDataPropertyValueType>>;
  interval$: Observable<ReadonlyArray<NotificationDataPropertyValueType>>;

  isAuthenticatedSubject = new BehaviorSubject(false);
  refetchSubject = new BehaviorSubject(null);
  deleteAllNotificationsSubject = new Subject<null>();
  deleteNotificationIdSubject = new Subject<number>();

  constructor(
    @Inject(SETTINGS) private settings: Settings,
    public notificationService: MyNotificationsService
  ) {
    /* TODO: remove this after review */
    interval(20 * 1000).subscribe(() => {
      console.log('apply testdata');
      notificationService.applyTestdata();
    });

    // stream of notifications
    this.notifications$ = this.refetchSubject.pipe(
      switchMap(() =>
        this.notificationService.getCurrentNotificationDataPropertyValue().pipe(
          catchError((err: HttpErrorResponse) => {
            if (err.status === 401) {
              this.isAuthenticatedSubject.next(false);
              return [];
            }
            return throwError(err);
          })
        )
      )
    );

    // check authentication
    this.notifications$.subscribe(() => this.isAuthenticatedSubject.next(true));

    // refetch notifications
    interval(this.settings.notificationRefreshTime * 1000).subscribe(() =>
      this.refetchSubject.next(null)
    );

    this.deleteNotificationIdSubject
      .pipe(
        withLatestFrom(this.notifications$),
        switchMap(([id, notifications]) =>
          this.notificationService.updateCurrentNotificationDataPropertyValue(
            this.deleteNotificationIdFromArray(id, notifications)
          )
        )
      )
      .subscribe(() => this.refetchSubject.next(null));

    this.deleteAllNotificationsSubject
      .pipe(
        withLatestFrom(this.notifications$),
        switchMap(() =>
          this.notificationService.updateCurrentNotificationDataPropertyValue(
            []
          )
        )
      )
      .subscribe(() => this.refetchSubject.next(null));
  }

  toggleNotificationsPopup(): void {
    const el = document.getElementById('notifications-popup');
    if (el && this.isAuthenticatedSubject.getValue()) {
      if (el.style.display === 'block') {
        el.style.display = 'none';
      } else {
        el.style.display = 'block';
      }
    }
  }

  deleteNotification(id: number): void {
    this.deleteNotificationIdSubject.next(id);
  }

  deleteAll(): void {
    this.deleteAllNotificationsSubject.next(null);
  }

  deleteNotificationIdFromArray(
    id: number,
    array: ReadonlyArray<NotificationDataPropertyValueType>
  ): ReadonlyArray<NotificationDataPropertyValueType> {
    return array.filter((item) => item.id !== id);
  }
}
