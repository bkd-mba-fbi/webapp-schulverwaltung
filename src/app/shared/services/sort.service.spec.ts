import { TestBed } from '@angular/core/testing';

import { Sorting, SortService } from './sort.service';

describe('SortService', () => {
  let service: SortService<string[]>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SortService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set the sorting', (done) => {
    // given
    const newSorting: Sorting<string[]> = {
      key: 1,
      ascending: true,
    };

    // when
    service.setSorting(newSorting);

    // then
    service.sorting$.subscribe((sorting) => {
      expect(sorting).toEqual(newSorting);
      done();
    });
  });

  it('should toggle the sorting', (done) => {
    // given
    const sorting: Sorting<string[]> = {
      key: 1,
      ascending: true,
    };
    service.setSorting(sorting);

    // when
    service.toggleSorting(1);

    // then
    service.sorting$.subscribe((result) => {
      expect(result).toEqual({ key: 1, ascending: false });
      done();
    });
  });

  describe('get sorting chars', () => {
    it('should get no char if no sorting is specified', (done) => {
      // given

      // when
      service.getSortingChar$({ key: 2, label: 'test' }).subscribe((char) => {
        // then
        expect(char).toBe('');
        done();
      });
    });

    it('should get no char if different column is sorted', (done) => {
      // given
      const sorting: Sorting<string[]> = { key: 1, ascending: true };

      // when
      service.getSortingChar$({ key: 2, label: 'test' }).subscribe((char) => {
        // then
        expect(char).toBe('');
        done();
      });
    });

    it('should get arrow down if column is sorted ascending', (done) => {
      // given
      const sorting: Sorting<string[]> = { key: 1, ascending: true };
      service.setSorting(sorting);

      // when
      service.getSortingChar$({ key: 1, label: 'test' }).subscribe((char) => {
        // then
        expect(char).toBe('↓');
        done();
      });
    });

    it('should get arrow up if column is sorted descending', (done) => {
      // given
      const sorting: Sorting<string[]> = { key: 1, ascending: false };
      service.setSorting(sorting);

      // when
      service.getSortingChar$({ key: 1, label: 'test' }).subscribe((char) => {
        // then
        expect(char).toBe('↑');
        done();
      });
    });
  });
});
