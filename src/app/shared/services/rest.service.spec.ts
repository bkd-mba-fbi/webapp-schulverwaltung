import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpTestingController } from '@angular/common/http/testing';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { RestService } from './rest.service';
import { SettingsService } from './settings.service';

interface FooModel {
  foo: string;
}

@Injectable()
class FooService extends RestService<FooModel> {
  constructor(http: HttpClient, settings: SettingsService) {
    super(http, settings, 'Foo');
  }
}

describe('RestService', () => {
  let service: FooService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [FooService]
      })
    );
    service = TestBed.get(FooService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  describe('.get', () => {
    it('requests single instance with given id', () => {
      service.get(123).subscribe(result => {
        expect(result).toEqual({ foo: 'bar' });
      });

      httpTestingController
        .expectOne('https://eventotest.api/Foo/123')
        .flush({ foo: 'bar' });
    });
  });

  describe('.getList', () => {
    it('requests multiple instances', () => {
      service.getList().subscribe(result => {
        expect(result).toEqual([{ foo: 'bar' }, { foo: 'baz' }]);
      });

      httpTestingController
        .expectOne('https://eventotest.api/Foo')
        .flush([{ foo: 'bar' }, { foo: 'baz' }]);
    });
  });
});
