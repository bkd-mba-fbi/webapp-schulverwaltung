import { TestModuleMetadata } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from './app/shared/shared.module';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/locales/', '.json');
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
  providers: []
};

export function buildTestModuleMetadata(
  data: TestModuleMetadata = {}
): TestModuleMetadata {
  return {
    ...baseTestModuleMetadata,
    ...data
  };
}
