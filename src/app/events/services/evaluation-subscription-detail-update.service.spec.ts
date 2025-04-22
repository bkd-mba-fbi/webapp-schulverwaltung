import { HttpTestingController } from "@angular/common/http/testing";
import { signal } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import isEqual from "lodash-es/isEqual";
import { SubscriptionDetail } from "src/app/shared/models/subscription.model";
import { ToastService } from "src/app/shared/services/toast.service";
import { buildSubscriptionDetail } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import {
  EvaluationStateService,
  EvaluationSubscriptionDetail,
} from "./evaluation-state.service";
import { EvaluationSubscriptionDetailUpdateService } from "./evaluation-subscription-detail-update.service";

describe("EvaluationSubscriptionDetailUpdateService", () => {
  let service: EvaluationSubscriptionDetailUpdateService;
  let stateMock: jasmine.SpyObj<EvaluationStateService>;
  let toastMock: jasmine.SpyObj<ToastService>;
  let httpTestingController: HttpTestingController;

  let detail: SubscriptionDetail;

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [
          EvaluationSubscriptionDetailUpdateService,
          {
            provide: EvaluationStateService,
            useFactory() {
              stateMock = jasmine.createSpyObj("EvaluationStateService", [
                "updateSubscriptionDetail",
              ]);
              return stateMock;
            },
          },
          {
            provide: ToastService,
            useFactory() {
              toastMock = jasmine.createSpyObj("ToastService", ["error"]);
              return toastMock;
            },
          },
        ],
      }),
    );
    service = TestBed.inject(EvaluationSubscriptionDetailUpdateService);
    httpTestingController = TestBed.inject(HttpTestingController);

    detail = buildSubscriptionDetail(1001, "Lorem ipsum");
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe("updateSubscriptionDetail", () => {
    it("does nothing if the value did not change", async () => {
      detail.Value = "Lorem ipsum";
      const evaluationDetail: EvaluationSubscriptionDetail = {
        detail,
        value: signal("Lorem ipsum"),
      };
      await service.updateSubscriptionDetail(evaluationDetail);

      expect(stateMock.updateSubscriptionDetail).not.toHaveBeenCalled();
      expect(evaluationDetail.value && evaluationDetail.value()).toBe(
        "Lorem ipsum",
      );
      expect(toastMock.error).not.toHaveBeenCalled();
    });

    it("saves the subscription detail value & updates the state on success", async () => {
      detail.Value = "Lorem ipsum";
      const evaluationDetail: EvaluationSubscriptionDetail = {
        detail,
        value: signal("Dolor sit amet"),
      };

      const result = service.updateSubscriptionDetail(evaluationDetail);
      expectUpdateRequest("Dolor sit amet");

      await result;
      expect(stateMock.updateSubscriptionDetail).toHaveBeenCalledWith(
        detail,
        "Dolor sit amet",
      );
      expect(evaluationDetail.value && evaluationDetail.value()).toBe(
        "Dolor sit amet",
      );
      expect(toastMock.error).not.toHaveBeenCalled();
    });

    it("reverts the state on error", async () => {
      detail.Value = "Lorem ipsum";
      const evaluationDetail: EvaluationSubscriptionDetail = {
        detail,
        value: signal("Dolor sit amet"),
      };

      const result = service.updateSubscriptionDetail(evaluationDetail);
      expectUpdateRequest("Dolor sit amet", 500);

      await result;
      expect(stateMock.updateSubscriptionDetail).not.toHaveBeenCalled();
      expect(evaluationDetail.value && evaluationDetail.value()).toBe(
        "Lorem ipsum",
      );
      expect(toastMock.error).toHaveBeenCalled();
    });
  });

  function expectUpdateRequest(
    value: SubscriptionDetail["Value"],
    responseStatus = 200,
  ): void {
    httpTestingController
      .expectOne((req) => {
        const matches =
          req.urlWithParams ===
            "https://eventotest.api/SubscriptionDetails/1" &&
          req.method === "PUT" &&
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          isEqual(req.body, { IdPerson: 1, EventId: 1, Value: value } as any);

        if (!matches) {
          console.log(
            "Received request that does not match:",
            `${req.method} ${req.urlWithParams}`,
            JSON.stringify(req.body),
          );
        }

        return matches;
      })
      .flush({}, { status: responseStatus, statusText: "" });
  }
});
