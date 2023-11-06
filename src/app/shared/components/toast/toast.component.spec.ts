import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { NgbToastConfig } from "@ng-bootstrap/ng-bootstrap";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { ToastService } from "../../services/toast.service";
import { ToastComponent } from "./toast.component";

describe("ToastComponent", () => {
  // let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;
  let element: HTMLElement;
  let service: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [ToastComponent],
        providers: [
          ToastService,
          {
            provide: NgbToastConfig,
            useValue: { delay: 5000, animation: false },
          },
        ],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    // component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
    service = TestBed.inject(ToastService);

    fixture.detectChanges();
  });

  it("renders toasts & auto hides them after delay", fakeAsync(() => {
    expect(queryToasts()).toHaveSize(0);

    // Displays first toast
    service.success("Toast 1");
    fixture.detectChanges();
    let toasts = queryToasts();
    expect(toasts).toHaveSize(1);
    expect(toasts[0].textContent).toContain("Toast 1");

    // First toast is still visible halfway through the autohide delay
    tick(2500);
    fixture.detectChanges();
    expect(queryToasts()).toHaveSize(1);

    // Displays second toast
    service.success("Toast 2");
    fixture.detectChanges();
    toasts = queryToasts();
    expect(toasts).toHaveSize(2);
    expect(toasts[0].textContent).toContain("Toast 1");
    expect(toasts[1].textContent).toContain("Toast 2");

    // First toast is hidden after first delay is over
    tick(2500);
    fixture.detectChanges();
    toasts = queryToasts();
    expect(toasts).toHaveSize(1);
    expect(toasts[0].textContent).toContain("Toast 2");

    // Second toast is hidden too after second delay is over
    tick(2500);
    fixture.detectChanges();
    expect(queryToasts()).toHaveSize(0);
  }));

  function queryToasts(): ReadonlyArray<HTMLElement> {
    return Array.from(element.querySelectorAll("ngb-toast"));
  }
});
