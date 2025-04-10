import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
  SubscriptionDetail,
  SubscriptionDetailType,
} from "../../models/subscription.model";
import { SubscriptionDetailFieldComponent } from "./subscription-detail-field.component";

describe("SubscriptionDetailFieldComponent", () => {
  let component: SubscriptionDetailFieldComponent;
  let fixture: ComponentFixture<SubscriptionDetailFieldComponent>;
  let element: HTMLElement;
  let detail: SubscriptionDetail;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionDetailFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SubscriptionDetailFieldComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
  });

  describe("Heading", () => {
    beforeEach(() => {
      detail = build({
        VssDesignation: "Heading",
        Id: "1",
        VssStyle: "HE",
      });
    });

    it("renders heading text", async () => {
      await render();

      expect(
        element.querySelector("bkd-subscription-detail-heading"),
      ).not.toBeNull();
      expect(element.textContent).toContain("Heading");
    });
  });

  describe("description", () => {
    beforeEach(() => {
      detail = build({
        VssDesignation: "Description",
        Id: "2",
        VssStyle: "BE",
        Value:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      });
    });

    it("renders description with label", async () => {
      await render();

      expect(
        element.querySelector("bkd-subscription-detail-description"),
      ).not.toBeNull();

      const label = element.querySelector("label");
      expect(label?.textContent).toContain("Description");

      expect(element.textContent).toContain(
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      );
    });

    it("renders description without label", async () => {
      fixture.componentRef.setInput("hideLabel", true);
      await render();

      expect(
        element.querySelector("bkd-subscription-detail-description"),
      ).not.toBeNull();

      const label = element.querySelector("label");
      expect(label).toBeNull();

      expect(element.textContent).toContain(
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      );
    });
  });

  describe("textfield", () => {
    beforeEach(() => {
      detail = build({
        VssDesignation: "Text field",
        Id: "3",
        VssTypeId: SubscriptionDetailType.ShortText,
        VssStyle: "TX",
        Value: "Lorem ipsum",
      });
    });

    it("renders textfield with label", async () => {
      await render();

      const label = element.querySelector("label");
      expect(label?.textContent).toContain("Text field");

      expect(
        element.querySelector("bkd-subscription-detail-textfield"),
      ).not.toBeNull();
      const input = element.querySelector("input");
      expect(input?.type).toBe("text");
      expect(input?.value).toBe("Lorem ipsum");
    });

    it("renders textfield without label", async () => {
      fixture.componentRef.setInput("hideLabel", true);
      await render();

      const label = element.querySelector("label");
      expect(label).toBeNull();

      expect(
        element.querySelector("bkd-subscription-detail-textfield"),
      ).not.toBeNull();
      const input = element.querySelector("input");
      expect(input?.type).toBe("text");
      expect(input?.value).toBe("Lorem ipsum");
    });

    it("emits value change on input", async () => {
      await render();

      const input = element.querySelector("input")!;
      dispatchEvent(input, "input", "New value");
      expect(component.detail()).toEqual({ ...detail, Value: "New value" });
    });

    it("emits value commit on blur", async () => {
      const commitCallback = jasmine.createSpy("commitCallback");
      component.commit.subscribe(commitCallback);

      await render();

      const input = element.querySelector("input")!;
      dispatchEvent(input, "input", "New value");
      expect(commitCallback).not.toHaveBeenCalled();

      dispatchEvent(input, "blur");
      expect(commitCallback).toHaveBeenCalledTimes(1);
      expect(commitCallback.calls.mostRecent().args[0]).toEqual({
        ...detail,
        Value: "New value",
      });
    });
  });

  describe("numberfield", () => {
    beforeEach(() => {
      detail = build({
        VssDesignation: "Number field",
        Id: "5",
        VssTypeId: SubscriptionDetailType.Int,
        VssStyle: "TX",
        Value: 42,
      });
    });

    it("renders numberfield with label", async () => {
      await render();

      const label = element.querySelector("label");
      expect(label?.textContent).toContain("Number field");

      expect(
        element.querySelector("bkd-subscription-detail-textfield"),
      ).not.toBeNull();
      const input = element.querySelector("input");
      expect(input?.type).toBe("number");
      expect(input?.value).toBe("42");
    });

    it("renders numberfield without label", async () => {
      fixture.componentRef.setInput("hideLabel", true);
      await render();

      const label = element.querySelector("label");
      expect(label).toBeNull();

      expect(
        element.querySelector("bkd-subscription-detail-textfield"),
      ).not.toBeNull();
      const input = element.querySelector("input");
      expect(input?.type).toBe("number");
      expect(input?.value).toBe("42");
    });

    it("emits value change on input", async () => {
      await render();

      const input = element.querySelector<HTMLInputElement>("input")!;
      dispatchEvent(input, "input", "123");
      expect(component.detail()).toEqual({ ...detail, Value: 123 });
    });

    it("emits value commit on blur", async () => {
      const commitCallback = jasmine.createSpy("commitCallback");
      component.commit.subscribe(commitCallback);

      await render();

      const input = element.querySelector<HTMLInputElement>("input")!;
      dispatchEvent(input, "input", "123");
      expect(commitCallback).not.toHaveBeenCalled();

      dispatchEvent(input, "blur");
      expect(commitCallback).toHaveBeenCalledTimes(1);
      expect(commitCallback.calls.mostRecent().args[0]).toEqual({
        ...detail,
        Value: 123,
      });
    });
  });

  describe("textarea", () => {
    beforeEach(() => {
      detail = build({
        VssDesignation: "Textarea",
        Id: "4",
        VssTypeId: SubscriptionDetailType.Text,
        VssStyle: "TX",
        Value: "Lorem ipsum",
      });
    });

    it("renders textarea with label", async () => {
      await render();

      const label = element.querySelector("label");
      expect(label?.textContent).toContain("Textarea");

      expect(
        element.querySelector("bkd-subscription-detail-textarea"),
      ).not.toBeNull();
      const textarea = element.querySelector("textarea");
      expect(textarea?.value).toBe("Lorem ipsum");
    });

    it("renders textarea without label", async () => {
      fixture.componentRef.setInput("hideLabel", true);
      await render();

      const label = element.querySelector("label");
      expect(label).toBeNull();

      expect(
        element.querySelector("bkd-subscription-detail-textarea"),
      ).not.toBeNull();
      const textarea = element.querySelector("textarea");
      expect(textarea?.value).toBe("Lorem ipsum");
    });

    it("emits value change on input", async () => {
      await render();

      const textarea = element.querySelector("textarea")!;
      dispatchEvent(textarea, "input", "New value");
      expect(component.detail()).toEqual({ ...detail, Value: "New value" });
    });

    it("emits value commit on blur", async () => {
      const commitCallback = jasmine.createSpy("commitCallback");
      component.commit.subscribe(commitCallback);

      await render();

      const textarea = element.querySelector("textarea")!;
      dispatchEvent(textarea, "input", "New value");
      expect(commitCallback).not.toHaveBeenCalled();

      dispatchEvent(textarea, "blur");
      expect(commitCallback).toHaveBeenCalledTimes(1);
      expect(commitCallback.calls.mostRecent().args[0]).toEqual({
        ...detail,
        Value: "New value",
      });
    });
  });

  describe("listbox", () => {
    beforeEach(() => {
      detail = build({
        VssDesignation: "Listbox",
        Id: "6",
        VssStyle: "LB",
        DropdownItems: [
          { Key: 1, Value: "Apple", IsActive: true },
          { Key: 2, Value: "Pear", IsActive: true },
          { Key: 3, Value: "Banana", IsActive: false },
        ],
        Value: 2,
      });
    });

    describe("select", () => {
      beforeEach(() => {
        detail.ShowAsRadioButtons = false;
      });

      it("renders select with label", async () => {
        await render();

        const label = element.querySelector("label");
        expect(label?.textContent).toContain("Listbox");

        expect(
          element.querySelector("bkd-subscription-detail-listbox"),
        ).not.toBeNull();
        const select = element.querySelector("select");
        const options = Array.from(select?.querySelectorAll("option") ?? []);
        expect(options.map((o) => o.textContent?.trim())).toEqual([
          "Apple",
          "Pear",
        ]);
        expect(select?.value).toBe("2");
      });

      it("renders select without label", async () => {
        fixture.componentRef.setInput("hideLabel", true);
        await render();

        const label = element.querySelector("label");
        expect(label).toBeNull();

        expect(
          element.querySelector("bkd-subscription-detail-listbox"),
        ).not.toBeNull();
        const select = element.querySelector("select");
        const options = Array.from(select?.querySelectorAll("option") ?? []);
        expect(options.map((o) => o.textContent?.trim())).toEqual([
          "Apple",
          "Pear",
        ]);
        expect(select?.value).toBe("2");
      });

      it("emits value change & commit on change", async () => {
        const commitCallback = jasmine.createSpy("commitCallback");
        component.commit.subscribe(commitCallback);

        await render();

        const select = element.querySelector("select")!;
        dispatchEvent(select, "change", "1");
        expect(component.detail()).toEqual({ ...detail, Value: 1 });
        expect(commitCallback.calls.mostRecent().args[0]).toEqual({
          ...detail,
          Value: 1,
        });
      });
    });

    describe("radios", () => {
      beforeEach(() => {
        detail.ShowAsRadioButtons = true;
      });

      it("renders radio buttons with label", async () => {
        await render();

        const label = element.querySelector("label");
        expect(label?.textContent).toContain("Listbox");

        expect(
          element.querySelector("bkd-subscription-detail-listbox"),
        ).not.toBeNull();
        const radios = Array.from(
          element.querySelectorAll<HTMLInputElement>("input[type=radio]"),
        );
        expect(
          radios.map((radio) => ({
            label: (radio.labels ?? [])[0]?.textContent?.trim(),
            checked: radio.checked,
          })),
        ).toEqual([
          { label: "Apple", checked: false },
          { label: "Pear", checked: true },
        ]);
      });

      it("renders radio buttons without label", async () => {
        fixture.componentRef.setInput("hideLabel", true);
        await render();

        const labels = Array.from(element.querySelectorAll("label"));
        expect(labels).toHaveSize(2);

        expect(
          element.querySelector("bkd-subscription-detail-listbox"),
        ).not.toBeNull();
        const radios = Array.from(
          element.querySelectorAll<HTMLInputElement>("input[type=radio]"),
        );
        expect(
          radios.map((radio) => ({
            label: (radio.labels ?? [])[0]?.textContent?.trim(),
            checked: radio.checked,
          })),
        ).toEqual([
          { label: "Apple", checked: false },
          { label: "Pear", checked: true },
        ]);
      });

      it("emits value change & commit on change", async () => {
        const commitCallback = jasmine.createSpy("commitCallback");
        component.commit.subscribe(commitCallback);

        await render();

        const radios = Array.from(
          element.querySelectorAll<HTMLInputElement>("input[type=radio]"),
        );
        radios[0].click();
        expect(component.detail()).toEqual({ ...detail, Value: 1 });
        expect(commitCallback.calls.mostRecent().args[0]).toEqual({
          ...detail,
          Value: 1,
        });
      });
    });
  });

  describe("Combobox", () => {
    beforeEach(() => {
      detail = build({
        VssDesignation: "Combobox",
        Id: "8",
        VssStyle: "CB",
        DropdownItems: [
          { Key: "Apple", Value: "Apple", IsActive: true },
          { Key: "Pear", Value: "Pear", IsActive: true },
          { Key: "Banana", Value: "Banana", IsActive: false },
        ],
        Value: "Strawberry",
      });
    });

    xit("renders combobox with label", () => {
      fixture.componentRef.setInput("detail", detail);
      fixture.detectChanges();
      expect(
        element.querySelector("bkd-subscription-detail-combobox"),
      ).not.toBeNull();
      // TODO
    });
  });

  async function render() {
    fixture.componentRef.setInput("detail", detail);
    fixture.detectChanges();
    await fixture.whenStable();
  }

  function dispatchEvent(
    element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
    eventType: string,
    value?: string,
  ): void {
    const inputEvent = new Event(eventType);
    if (value !== undefined) {
      element.value = value;
    }
    element.dispatchEvent(inputEvent);
  }

  function build(detail: Partial<SubscriptionDetail>): SubscriptionDetail {
    return {
      Id: "1",
      SubscriptionId: 1,
      VssId: 1,
      EventId: 1,
      IdPerson: 1,
      DropdownItems: [],
      ShowAsRadioButtons: false,
      VssType: "",
      VssTypeId: SubscriptionDetailType.ShortText,
      VssStyle: "TX",
      VssInternet: "E",
      VssDesignation: "",
      Tooltip: "",
      Value: null,
      Sort: "",
      ...detail,
    };
  }
});
