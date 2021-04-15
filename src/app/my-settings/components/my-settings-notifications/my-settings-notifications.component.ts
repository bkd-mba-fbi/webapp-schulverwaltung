import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { NotificationPropertyValueType } from 'src/app/shared/models/user-setting.model';
import { MySettingsService } from '../../services/my-settings.service';
import { shareReplay, map, take, finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'erz-my-settings-notifications',
  templateUrl: './my-settings-notifications.component.html',
  styleUrls: ['./my-settings-notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MySettingsNotificationsComponent implements OnInit {
  notificationSettings$ = this.settingsService.getCurrentNotificationSettingsPropertyValue();
  notificationFormGroup$ = this.notificationSettings$.pipe(
    map(this.createNotificationFormGroup.bind(this)),
    shareReplay(1)
  );

  saving$ = new BehaviorSubject(false);
  private submitted$ = new BehaviorSubject(false);

  constructor(
    private settingsService: MySettingsService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {}

  private createNotificationFormGroup(
    notifications: NotificationPropertyValueType
  ): FormGroup {
    return this.formBuilder.group({
      notificationsGui: [notifications.gui],
      notificationsMail: [notifications.mail],
      notificationsPhoneMobile: [notifications.phoneMobile],
    });
  }

  onSubmit(): void {
    this.submitted$.next(true);
    this.notificationFormGroup$.pipe(take(1)).subscribe((formGroup) => {
      if (formGroup.valid) {
        const {
          notificationsGui,
          notificationsMail,
          notificationsPhoneMobile,
        } = formGroup.value;
        this.save(
          notificationsGui,
          notificationsMail,
          notificationsPhoneMobile
        );
      }
    });
  }

  private save(gui: boolean, mail: boolean, phoneMobile: boolean): void {
    this.saving$.next(true);
    this.settingsService
      .updateCurrentNotificationSettingsPropertyValue(gui, mail, phoneMobile)
      .pipe(finalize(() => this.saving$.next(false)))
      .subscribe(this.onSaveSuccess.bind(this));
  }

  private onSaveSuccess(): void {
    this.toastr.success(
      this.translate.instant('my-settings.notifications.save-success')
    );
  }
}
