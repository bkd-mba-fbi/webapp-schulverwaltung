import {
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  BehaviorSubject,
  interval,
  Observable,
  Subject,
  throwError,
} from 'rxjs';
import {
  catchError,
  shareReplay,
  startWith,
  switchMap,
  takeUntil,
  withLatestFrom,
} from 'rxjs/operators';
import {
  NotificationData,
  NotificationDataEntry,
} from 'src/app/shared/models/user-settings.model';
import { SETTINGS, Settings } from 'src/app/settings';
import { HttpErrorResponse } from '@angular/common/http';
import { I18nService } from 'src/app/shared/services/i18n.service';
import { UserSettingsService } from 'src/app/shared/services/user-settings.service';

@Component({
  templateUrl: './my-notifications-show.component.html',
  styleUrls: ['./my-notifications-show.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class MyNotificationsShowComponent implements OnDestroy {
  @ViewChild('notificationspopup') popup: ElementRef<HTMLElement>;

  notifications$ = this.loadNotifications().pipe(shareReplay());
  isAuthenticated$ = new BehaviorSubject(false);

  private refetchTimer$ = interval(
    this.settings.notificationRefreshTime * 1000
  ).pipe(
    startWith(null) // Make sure we have "fresh" notifications when this component gets rendered initially
  );
  private deleteAllNotifications$ = new Subject<void>();
  private deleteNotification$ = new Subject<number>();
  private toggleNotificationsPopup$ = new Subject<any>();
  private destroy$ = new Subject<void>();

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
    i18n: I18nService,
    @Inject(SETTINGS) private settings: Settings,
    public userSettings: UserSettingsService
  ) {
    i18n.initialize();

    // Check authentication
    this.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.isAuthenticated$.next(true));

    // Toggle notification popup
    this.toggleNotificationsPopup$
      .pipe(withLatestFrom(this.isAuthenticated$), takeUntil(this.destroy$))
      .subscribe(([el, a]) => {
        if (el && a === true) {
          if (el.style.display === 'block') {
            el.style.display = 'none';
          } else {
            el.style.display = 'block';
          }
        }
      });

    // Refetch notifications periodically (polling)
    this.refetchTimer$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.userSettings.refetch());

    this.deleteNotification$
      .pipe(
        withLatestFrom(this.notifications$),
        switchMap(([id, notifications]) =>
          this.userSettings.saveNotificationData(
            this.deleteNotificationFromArray(id, notifications)
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.deleteAllNotifications$
      .pipe(
        switchMap(() => this.userSettings.saveNotificationData([])),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleNotificationsPopup(): void {
    if (this.popup.nativeElement) {
      this.toggleNotificationsPopup$.next(this.popup.nativeElement);
    }
  }

  deleteNotification(id: number): void {
    this.deleteNotification$.next(id);
  }

  deleteAll(): void {
    this.deleteAllNotifications$.next();
  }

  deleteNotificationFromArray(
    id: number,
    data: NotificationData
  ): NotificationData {
    return data.filter((entry) => entry.id !== id);
  }

  private loadNotifications(): Observable<
    ReadonlyArray<NotificationDataEntry>
  > {
    return this.userSettings.getNotificationData().pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.isAuthenticated$.next(false);
          return [];
        }
        return throwError(() => err);
      })
    );
  }
}
