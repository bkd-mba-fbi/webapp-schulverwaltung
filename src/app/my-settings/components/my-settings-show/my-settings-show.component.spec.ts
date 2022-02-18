import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { MySettingsService } from '../../services/my-settings.service';
import { MySettingsNotificationsComponent } from '../my-settings-notifications/my-settings-notifications.component';

import { MySettingsShowComponent } from './my-settings-show.component';

describe('MySettingsShowComponent', () => {
  let component: MySettingsShowComponent;
  let fixture: ComponentFixture<MySettingsShowComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule(
        buildTestModuleMetadata({
          providers: [MySettingsService],
          declarations: [
            MySettingsShowComponent,
            MySettingsNotificationsComponent,
          ],
        })
      ).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MySettingsShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
