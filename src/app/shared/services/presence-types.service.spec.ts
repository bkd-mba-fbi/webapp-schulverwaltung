import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import * as t from 'io-ts/lib/index';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { PresenceTypesService } from './presence-types.service';
import { PresenceType } from '../models/presence-type.model';

describe('PresenceTypesService', () => {
  let service: PresenceTypesService;
  let httpTestingController: HttpTestingController;

  let present: PresenceType;
  let doctor: PresenceType;
  let illness: PresenceType;
  let uk: PresenceType;
  let ek: PresenceType;
  let halfday: PresenceType;
  let dispensation: PresenceType;
  let late: PresenceType;
  let death: PresenceType;
  let accident: PresenceType;
  let military: PresenceType;
  let other: PresenceType;
  let comment: PresenceType;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(PresenceTypesService);
    httpTestingController = TestBed.inject(HttpTestingController);

    present = {
      Designation: 'Abwesend',
      Active: true,
      Sort: 0,
      NeedsConfirmation: true,
      IsAbsence: true,
      IsDispensation: false,
      IsIncident: false,
      IsComment: false,
      IsHalfDay: false,
      Id: 11,
    };
    comment = {
      Designation: 'Kommentar',
      Active: true,
      Sort: 1,
      NeedsConfirmation: false,
      IsAbsence: false,
      IsDispensation: false,
      IsIncident: false,
      IsComment: true,
      IsHalfDay: false,
      Id: 10000,
    };
    halfday = {
      Designation: 'Freier Halbtag',
      Active: true,
      Sort: 2,
      NeedsConfirmation: false,
      IsAbsence: true,
      IsDispensation: false,
      IsIncident: false,
      IsComment: false,
      IsHalfDay: true,
      Id: 17,
    };
    dispensation = {
      Designation: 'Dispensation',
      Active: true,
      Sort: 3,
      NeedsConfirmation: false,
      IsAbsence: false,
      IsDispensation: true,
      IsIncident: false,
      IsComment: false,
      IsHalfDay: false,
      Id: 18,
    };
    doctor = {
      Designation: 'Arzt- oder Zahnarztbesuch',
      Active: true,
      Sort: 4,
      NeedsConfirmation: true,
      IsAbsence: true,
      IsDispensation: false,
      IsIncident: false,
      IsComment: false,
      IsHalfDay: false,
      Id: 12,
    };
    late = {
      Designation: 'Verspätung',
      Active: true,
      Sort: 5,
      NeedsConfirmation: false,
      IsAbsence: false,
      IsDispensation: false,
      IsIncident: true,
      IsComment: false,
      IsHalfDay: false,
      Id: 20,
    };
    illness = {
      Designation: 'Krankheit',
      Active: true,
      Sort: 6,
      NeedsConfirmation: true,
      IsAbsence: true,
      IsDispensation: false,
      IsIncident: false,
      IsComment: false,
      IsHalfDay: false,
      Id: 13,
    };
    military = {
      Designation: 'Dienstpflicht',
      Active: true,
      Sort: 7,
      NeedsConfirmation: true,
      IsAbsence: true,
      IsDispensation: false,
      IsIncident: false,
      IsComment: false,
      IsHalfDay: false,
      Id: 23,
    };
    ek = {
      Designation: 'Teilnahme an externen Kursen',
      Active: true,
      Sort: 8,
      NeedsConfirmation: true,
      IsAbsence: true,
      IsDispensation: false,
      IsIncident: false,
      IsComment: false,
      IsHalfDay: false,
      Id: 16,
    };
    death = {
      Designation: 'Todesfall in der Familie',
      Active: true,
      Sort: 9,
      NeedsConfirmation: true,
      IsAbsence: true,
      IsDispensation: false,
      IsIncident: false,
      IsComment: false,
      IsHalfDay: false,
      Id: 21,
    };
    uk = {
      Designation: 'Überbetriebliche Kurse ÜK',
      Active: false,
      Sort: 10,
      NeedsConfirmation: true,
      IsAbsence: true,
      IsDispensation: false,
      IsIncident: false,
      IsComment: false,
      IsHalfDay: false,
      Id: 15,
    };
    accident = {
      Designation: 'Unfall',
      Active: true,
      Sort: 11,
      NeedsConfirmation: true,
      IsAbsence: true,
      IsDispensation: false,
      IsIncident: false,
      IsComment: false,
      IsHalfDay: false,
      Id: 22,
    };
    other = {
      Designation: 'Andere Gründe',
      Active: true,
      Sort: 50,
      NeedsConfirmation: true,
      IsAbsence: true,
      IsDispensation: false,
      IsIncident: false,
      IsComment: false,
      IsHalfDay: false,
      Id: 24,
    };
  });

  afterEach(() => {
    httpTestingController
      .expectOne('https://eventotest.api/PresenceTypes/')
      .flush(
        t
          .array(PresenceType)
          .encode([
            present,
            doctor,
            illness,
            uk,
            ek,
            halfday,
            dispensation,
            late,
            death,
            accident,
            military,
            other,
            comment,
          ]),
      );

    httpTestingController.verify();
  });

  describe('.presenceTypes$', () => {
    it('emits all presence types, ordered by Sort attribute', () => {
      service.presenceTypes$.subscribe((result) => {
        expect(result).toEqual([
          present,
          comment,
          halfday,
          dispensation,
          doctor,
          late,
          illness,
          military,
          ek,
          death,
          uk,
          accident,
          other,
        ]);
      });
    });
  });

  describe('.activePresenceTypes$', () => {
    it('emits all presence types, ordered by Sort attribute', () => {
      service.activePresenceTypes$.subscribe((result) => {
        expect(result).toEqual([
          present,
          comment,
          halfday,
          dispensation,
          doctor,
          late,
          illness,
          military,
          ek,
          death,
          accident,
          other,
        ]);
      });
    });
  });

  describe('.confirmationTypes$', () => {
    it('emits absences that are active and need confirmation', () => {
      service.confirmationTypes$.subscribe((result) => {
        expect(result).toEqual([
          doctor,
          illness,
          military,
          ek,
          death,
          accident,
          other,
        ]);
      });
    });
  });

  describe('.incidentTypes$', () => {
    it('emits presence types that are incidents', () => {
      service.incidentTypes$.subscribe((result) => {
        expect(result).toEqual([late]);
      });
    });
  });

  describe('.halfDayActive$', () => {
    let callback: jasmine.Spy;

    beforeEach(() => {
      callback = jasmine.createSpy('callback');
    });

    it('emits true if half day presence type is active', () => {
      halfday.Active = true;
      service.halfDayActive$.subscribe({
        next: callback,
        complete: () => {
          expect(callback.calls.allArgs()).toEqual([[false], [true]]);
        },
      });
    });

    it('emits false if half day presence type is not active', () => {
      halfday.Active = false;
      service.halfDayActive$.subscribe({
        next: callback,
        complete: () => {
          expect(callback.calls.allArgs()).toEqual([[false]]);
        },
      });
    });
  });
});
