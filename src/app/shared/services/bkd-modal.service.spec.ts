import { TestBed } from "@angular/core/testing";
import { BkdModalService } from "./bkd-modal.service";

describe("BkdModalService", () => {
  let service: BkdModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BkdModalService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
