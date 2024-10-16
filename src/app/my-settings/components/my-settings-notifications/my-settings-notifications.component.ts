import { AsyncPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
} from "@angular/forms";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { BehaviorSubject, Observable, Subject, merge, of } from "rxjs";
import {
  distinctUntilChanged,
  finalize,
  map,
  shareReplay,
  skip,
  switchMap,
  takeUntil,
  withLatestFrom,
} from "rxjs/operators";
import {
  NotificationChannels,
  NotificationTypesInactive,
} from "src/app/shared/models/user-settings.model";
import { NotificationTypesService } from "src/app/shared/services/notification-types.service";
import { UserSettingsService } from "src/app/shared/services/user-settings.service";
import { SpinnerComponent } from "../../../shared/components/spinner/spinner.component";
import { ToastService } from "../../../shared/services/toast.service";
import { MySettingsNotificationsToggleComponent } from "../my-settings-notifications-toggle/my-settings-notifications-toggle.component";

interface NotificationSetting {
  key: string;
  label: Observable<string>;
  description?: Observable<string>;
}

@Component({
  selector: "bkd-my-settings-notifications",
  templateUrl: "./my-settings-notifications.component.html",
  styleUrls: ["./my-settings-notifications.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    SpinnerComponent,
    FormsModule,
    ReactiveFormsModule,
    MySettingsNotificationsToggleComponent,
    AsyncPipe,
    TranslateModule,
  ],
})
export class MySettingsNotificationsComponent implements OnInit, OnDestroy {
  channelsSettings: ReadonlyArray<NotificationSetting> = [
    {
      key: "gui",
      label: this.translate.get("my-settings.notifications.gui"),
    },
    {
      key: "mail",
      label: this.translate.get("my-settings.notifications.mail"),
    },
    {
      key: "phoneMobile",
      label: this.translate.get("my-settings.notifications.phoneMobile"),
    },
  ];

  typesSettings: ReadonlyArray<NotificationSetting> = this.notificationTypes
    .getNotificationTypes()
    .map((type) => {
      const { label, description } =
        this.translate.currentLang === "fr-CH" ? type.text.fr : type.text.de;
      return {
        key: type.key,
        label: of(label),
        description: of(description),
      };
    });

  private channelsValue$ = this.userSettings.getNotificationChannels();
  private typesValue$ = this.userSettings
    .getNotificationTypesInactive()
    .pipe(map(this.typesArrayToRecord.bind(this)));

  channelsFormGroup$ = this.channelsValue$.pipe(
    map((value) => this.createFormGroup(this.channelsSettings, value)),
    shareReplay(1),
  );
  allChannelsInactive$ = merge(
    this.channelsValue$,
    this.channelsFormGroup$.pipe(
      switchMap((formGroup) => formGroup.valueChanges),
    ),
  ).pipe(
    map((channels) => Object.values(channels).every((enabled) => !enabled)),
    distinctUntilChanged(),
  );

  typesFormGroup$ = this.typesValue$.pipe(
    withLatestFrom(this.allChannelsInactive$),
    map(([value, allChannelsInactive]) =>
      this.createFormGroup(
        this.typesSettings,
        value,
        true,
        allChannelsInactive,
      ),
    ),
    shareReplay(1),
  );

  saving$ = new BehaviorSubject(false);
  private destroy$ = new Subject<void>();

  constructor(
    private userSettings: UserSettingsService,
    private formBuilder: UntypedFormBuilder,
    private toastService: ToastService,
    private translate: TranslateService,
    private notificationTypes: NotificationTypesService,
  ) {}

  ngOnInit(): void {
    // Make sure we have fresh settings, even if the have been loaded previously
    this.userSettings.refetch();

    // Update disabled state of types fields
    this.allChannelsInactive$
      .pipe(
        skip(1),
        withLatestFrom(this.typesFormGroup$),
        takeUntil(this.destroy$),
      )
      .subscribe(([allChannelsInactive, formGroup]) => {
        Object.values(formGroup.controls).forEach((control) =>
          allChannelsInactive ? control.disable() : control.enable(),
        );
      });

    // Autosave the notification channels setting on each change
    this.channelsFormGroup$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((formGroup) => formGroup.valueChanges),
      )
      .subscribe(this.saveChannels.bind(this));

    // Autosave the notification types setting on each change
    this.typesFormGroup$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((formGroup) => formGroup.valueChanges),
      )
      .subscribe(this.saveTypes.bind(this));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  private createFormGroup(
    settings: ReadonlyArray<NotificationSetting>,
    record: Record<string, boolean>,
    defaultValue = false,
    disabled = false,
  ): UntypedFormGroup {
    return this.formBuilder.group(
      settings.reduce(
        (acc, { key }) => ({
          ...acc,
          [key]: [{ value: record[key] ?? defaultValue, disabled }],
        }),
        {},
      ),
    );
  }

  private saveChannels(channels: NotificationChannels): void {
    this.saving$.next(true);
    this.userSettings
      .saveNotificationChannels(channels)
      .pipe(finalize(() => this.saving$.next(false)))
      .subscribe(this.onSaveSuccess.bind(this));
  }

  private saveTypes(record: Record<string, boolean>): void {
    this.saving$.next(true);
    this.userSettings
      .saveNotificationTypesInactive(this.typesRecordToArray(record))
      .pipe(finalize(() => this.saving$.next(false)))
      .subscribe(this.onSaveSuccess.bind(this));
  }

  private onSaveSuccess(): void {
    this.toastService.success(
      this.translate.instant("my-settings.notifications.save-success"),
    );
  }

  private typesArrayToRecord(
    inactiveTypes: NotificationTypesInactive,
  ): Record<string, boolean> {
    const result = this.typesSettings.reduce(
      (acc, { key }) => ({ ...acc, [key]: !inactiveTypes.includes(key) }),
      {},
    );
    return result;
  }

  private typesRecordToArray(
    record: Record<string, boolean>,
  ): NotificationTypesInactive {
    const result = Object.keys(record).reduce(
      (acc, key) => (!record[key] ? [...acc, key] : acc),
      [] as NotificationTypesInactive,
    );
    return result;
  }
}
