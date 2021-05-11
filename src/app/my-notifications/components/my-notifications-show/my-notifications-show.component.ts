import { Component, Inject, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  interval,
  Observable,
  ReplaySubject,
  Subject,
  throwError,
} from 'rxjs';
import {
  catchError,
  switchMap,
  takeUntil,
  withLatestFrom,
} from 'rxjs/operators';
import { NotificationDataPropertyValueType } from 'src/app/shared/models/user-setting.model';
import { MyNotificationsService } from '../../services/my-notifications.service';
import { SETTINGS, Settings } from 'src/app/settings';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  templateUrl: './my-notifications-show.component.html',
  styleUrls: ['./my-notifications-show.component.scss'],
})
export class MyNotificationsShowComponent implements OnDestroy {
  notifications$: Observable<ReadonlyArray<NotificationDataPropertyValueType>>;

  trigger$ = interval(this.settings.notificationRefreshTime * 1000);
  refetch$ = new BehaviorSubject(null);
  isAuthenticated$ = new BehaviorSubject(false);
  deleteAllNotifications$ = new Subject<null>();
  deleteNotificationId$ = new Subject<number>();
  toggleNotificationsPopup$ = new Subject<any>();

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  public xssOptions = {
    whiteList: {
      br: [],
      div: ['style'],
      span: ['style'],
      a: ['href'],
      ul: [],
      ol: [],
      li: [],
      sup: [],
      sub: [],
      code: [],
      cite: [],
    },
    css: false,
  };

  constructor(
    @Inject(SETTINGS) private settings: Settings,
    public notificationService: MyNotificationsService
  ) {
    // stream of notifications
    this.notifications$ = this.refetch$.pipe(
      switchMap(() =>
        this.notificationService.getCurrentNotificationDataPropertyValue().pipe(
          catchError((err: HttpErrorResponse) => {
            if (err.status === 401) {
              this.isAuthenticated$.next(false);
              return [];
            }
            return throwError(err);
          })
        )
      )
    );

    // check authentication
    this.notifications$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => this.isAuthenticated$.next(true));

    // toggle notification popup
    this.toggleNotificationsPopup$
      .pipe(withLatestFrom(this.isAuthenticated$), takeUntil(this.destroyed$))
      .subscribe(([el, a]) => {
        if (el && a === true) {
          if (el.style.display === 'block') {
            el.style.display = 'none';
          } else {
            el.style.display = 'block';
          }
        }
      });

    // refetch notifications
    this.trigger$.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.refetch$.next(null);
      console.log('trigger');
    });

    this.deleteNotificationId$
      .pipe(
        withLatestFrom(this.notifications$),
        switchMap(([id, notifications]) =>
          this.notificationService.updateCurrentNotificationDataPropertyValue(
            this.deleteNotificationIdFromArray(id, notifications)
          )
        )
      )
      .subscribe(() => this.refetch$.next(null));

    this.deleteAllNotifications$
      .pipe(
        withLatestFrom(this.notifications$),
        switchMap(() =>
          this.notificationService.updateCurrentNotificationDataPropertyValue(
            []
          )
        )
      )
      .subscribe(() => this.refetch$.next(null));
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  toggleNotificationsPopup(): void {
    const el = document.getElementById('notifications-popup');
    this.toggleNotificationsPopup$.next(el);
  }

  deleteNotification(id: number): void {
    this.deleteNotificationId$.next(id);
  }

  deleteAll(): void {
    this.deleteAllNotifications$.next(null);
  }

  deleteNotificationIdFromArray(
    id: number,
    array: ReadonlyArray<NotificationDataPropertyValueType>
  ): ReadonlyArray<NotificationDataPropertyValueType> {
    return array.filter((item) => item.id !== id);
  }
}
