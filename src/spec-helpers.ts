import { SimpleChanges, SimpleChange } from '@angular/core';
import { TestModuleMetadata } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ToastrModule } from 'ngx-toastr';

import { SharedModule } from './app/shared/shared.module';
import { Settings, SETTINGS } from './app/settings';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/locales/', '.json');
}

const settings: Settings = {
  apiUrl: 'https://eventotest.api',
  absencePresenceTypeId: 11,
  latePresenceTypeId: 12
};

const baseTestModuleMetadata: TestModuleMetadata = {
  imports: [
    RouterTestingModule,
    HttpClientTestingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ToastrModule,
    SharedModule
  ],
  providers: [{ provide: SETTINGS, useValue: settings }]
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

export function changeInputs<
  T extends { ngOnChanges?(changes?: SimpleChanges): void }
>(
  component: T,
  changes: { property: keyof T; value: T[keyof T]; firstChange?: boolean }[]
): void {
  const simpleChanges: SimpleChanges = changes.reduce(
    (acc, { property, value, firstChange }) =>
      Object.assign(acc, {
        [property]: createInputChange(component, property, value, firstChange)
      }),
    {}
  );

  if (typeof component.ngOnChanges === 'function') {
    component.ngOnChanges(simpleChanges);
  }
}

export function changeInput<
  T extends { ngOnChanges?(changes?: SimpleChanges): void }
>(
  component: T,
  property: keyof T,
  value: T[keyof T],
  firstChange = false
): T[keyof T] {
  changeInputs(component, [{ property, value, firstChange }]);
  return value;
}

function createInputChange<
  T extends { ngOnChanges?(changes?: SimpleChanges): void }
>(
  component: T,
  property: keyof T,
  value: T[keyof T],
  firstChange = false
): SimpleChange {
  const previousValue = component[property];
  const change = new SimpleChange(previousValue, value, firstChange);

  component[property] = value;

  return change;
}
