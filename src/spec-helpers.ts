import { TestModuleMetadata } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from './app/shared/shared.module';
import {
  SettingsService,
  Settings
} from './app/shared/services/settings.service';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/locales/', '.json');
}

class SettingsMockService extends SettingsService {
  protected get settings(): Option<Settings> {
    return {
      apiUrl: 'https://eventotest.api'
    };
  }
}

const baseTestModuleMetadata: TestModuleMetadata = {
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    RouterTestingModule,
    HttpClientTestingModule,
    SharedModule
  ],
  providers: [{ provide: SettingsService, useClass: SettingsMockService }]
};

export function buildTestModuleMetadata(
  data: TestModuleMetadata = {}
): TestModuleMetadata {
  const result: any = { ...data };
  Object.keys(baseTestModuleMetadata).forEach(key => {
    result[key] = [
      ...(baseTestModuleMetadata as any)[key],
      ...((data && (data as any)[key]) || [])
    ];
  });
  return result;
}
