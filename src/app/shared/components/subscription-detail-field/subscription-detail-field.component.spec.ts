import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import {
  SubscriptionDetail,
  SubscriptionDetailType,
} from "../../models/subscription.model";
import { SubscriptionDetailFieldComponent } from "./subscription-detail-field.component";

describe("SubscriptionDetailFieldComponent", () => {
  let component: SubscriptionDetailFieldComponent;
  let fixture: ComponentFixture<SubscriptionDetailFieldComponent>;
  let element: HTMLElement;
  let commitCallback: jasmine.Spy;
  let detail: SubscriptionDetail;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [SubscriptionDetailFieldComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(SubscriptionDetailFieldComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;

    commitCallback = jasmine.createSpy("commitCallback");
    component.commit.subscribe(commitCallback);
  });

  describe("heading", () => {
    beforeEach(() => {
      detail = build({
        VssDesignation: "Heading",
        Id: "1",
        VssStyle: "HE",
      });
    });

    it("renders heading text", async () => {
      await render();

      expectComponent("bkd-subscription-detail-heading");
      expect(element.textContent).toContain("Heading");
    });
  });

  describe("description", () => {
    beforeEach(() => {
      detail = build({
        VssDesignation: "Description",
        VssStyle: "BE",
        Value:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      });
    });

    it("renders description with label", async () => {
      await render();

      expectComponent("bkd-subscription-detail-description");
      expectLabel("Description");

      expect(element.textContent).toContain(
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      );
    });

    it("renders description without label", async () => {
      fixture.componentRef.setInput("hideLabel", true);
      await render();

      expectComponent("bkd-subscription-detail-description");
      expectNoLabel();

      expect(element.textContent).toContain(
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      );
    });
  });

  describe("text field", () => {
    beforeEach(() => {
      detail = build({
        VssDesignation: "Text field",
        VssTypeId: SubscriptionDetailType.ShortText,
        VssStyle: "TX",
        Value: "Lorem ipsum",
      });
    });

    it("renders text field with label", async () => {
      await render();

      expectComponent("bkd-subscription-detail-textfield");
      expectLabel("Text field");

      const input = getInput();
      expect(input.type).toBe("text");
      expect(input.value).toBe("Lorem ipsum");
    });

    it("renders text field without label", async () => {
      fixture.componentRef.setInput("hideLabel", true);
      await render();

      expectComponent("bkd-subscription-detail-textfield");
      expectNoLabel();

      const input = getInput();
      expect(input.type).toBe("text");
      expect(input.value).toBe("Lorem ipsum");
    });

    it("emits value change on input & commit on blur", async () => {
      await render();

      const input = getInput();
      input.focus();
      dispatchEvent(input, "input", "New value");
      expectChange("New value");
      expectNoCommit();

      dispatchEvent(input, "blur");
      expectCommit("New value");
    });
  });

  describe("integer field", () => {
    beforeEach(() => {
      detail = build({
        VssDesignation: "Integer field",
        VssTypeId: SubscriptionDetailType.Int,
        VssStyle: "TX",
        Value: 42,
      });
    });

    it("renders number field with label", async () => {
      await render();

      expectComponent("bkd-subscription-detail-textfield");
      expectLabel("Integer field");

      const input = getInput();
      expect(input.type).toBe("number");
      expect(input.value).toBe("42");
    });

    it("renders number field without label", async () => {
      fixture.componentRef.setInput("hideLabel", true);
      await render();

      expectComponent("bkd-subscription-detail-textfield");
      expectNoLabel();

      const input = getInput();
      expect(input.type).toBe("number");
      expect(input.value).toBe("42");
    });

    it("emits value change on input & commit on blur", async () => {
      await render();

      const input = element.querySelector<HTMLInputElement>("input")!;
      input.focus();
      dispatchEvent(input, "input", "123");
      expectChange(123);
      expectNoCommit();

      dispatchEvent(input, "blur");
      expectCommit(123);
    });

    it("emits value change & commit on input of unfocused field (i.e. click on number field arrows)", async () => {
      await render();

      const input = element.querySelector<HTMLInputElement>("input")!;
      dispatchEvent(input, "input", "123");
      expectChange(123);
      expectCommit(123);
    });

    it("does not allow to enter a float value", async () => {
      await render();

      const input = element.querySelector<HTMLInputElement>("input")!;
      input.focus();
      dispatchEvent(input, "input", "123.45");
      expectChange(123);
      expectNoCommit();

      dispatchEvent(input, "blur");
      expectCommit(123);
    });

    it("does not allow to enter an alpha value", async () => {
      await render();

      const input = element.querySelector<HTMLInputElement>("input")!;
      input.focus();
      dispatchEvent(input, "input", "Lorem ipsum");
      expectChange(null);
      expectNoCommit();

      dispatchEvent(input, "blur");
      expectCommit(null);
    });
  });

  describe("currency field", () => {
    beforeEach(() => {
      detail = build({
        VssDesignation: "Currency field",
        VssTypeId: SubscriptionDetailType.Currency,
        VssStyle: "TX",
        Value: "12.30",
      });
    });

    it("renders number field with label", async () => {
      await render();

      expectComponent("bkd-subscription-detail-textfield");
      expectLabel("Currency field");

      const input = getInput();
      expect(input.type).toBe("number");
      expect(input.value).toBe("12.30");
    });

    it("renders number field without label", async () => {
      fixture.componentRef.setInput("hideLabel", true);
      await render();

      expectComponent("bkd-subscription-detail-textfield");
      expectNoLabel();

      const input = getInput();
      expect(input.type).toBe("number");
      expect(input.value).toBe("12.30");
    });

    it("emits value change on input & commit on blur, formatting the value with two decimals", async () => {
      await render();

      const input = getInput();
      input.focus();
      dispatchEvent(input, "input", "123");
      expectChange("123");
      expectNoCommit();

      dispatchEvent(input, "blur");
      expectCommit("123.00");
    });
  });

  describe("textarea", () => {
    beforeEach(() => {
      detail = build({
        VssDesignation: "Textarea",
        VssTypeId: SubscriptionDetailType.Text,
        VssStyle: "TX",
        Value: "Lorem ipsum",
      });
    });

    it("renders textarea with label", async () => {
      await render();

      expectComponent("bkd-subscription-detail-textarea");
      expectLabel("Textarea");

      const textarea = getTextarea();
      expect(textarea.value).toBe("Lorem ipsum");
    });

    it("renders textarea without label", async () => {
      fixture.componentRef.setInput("hideLabel", true);
      await render();

      expectComponent("bkd-subscription-detail-textarea");
      expectNoLabel();

      const textarea = getTextarea();
      expect(textarea.value).toBe("Lorem ipsum");
    });

    it("emits value change on input & commit on blur", async () => {
      await render();

      const textarea = getTextarea();
      dispatchEvent(textarea, "input", "New value");
      expectChange("New value");
      expectNoCommit();

      dispatchEvent(textarea, "blur");
      expectCommit("New value");
    });
  });

  describe("date field", () => {
    beforeEach(() => {
      detail = build({
        VssDesignation: "Date field",
        VssTypeId: SubscriptionDetailType.Date,
        VssStyle: "TX",
        Value: "23.01.2000",
      });
    });

    it("renders datepicker field with label", async () => {
      await render();

      expectComponent("bkd-subscription-detail-datefield");
      expectLabel("Date field");

      const input = getInput();
      expect(input.type).toBe("text");
      expect(input.value).toBe("23.01.2000");
    });

    it("renders datepicker field without label", async () => {
      fixture.componentRef.setInput("hideLabel", true);
      await render();

      expectComponent("bkd-subscription-detail-datefield");
      expectNoLabel();

      const input = getInput();
      expect(input.type).toBe("text");
      expect(input.value).toBe("23.01.2000");
    });

    it("emits value change on input & commit on blur", async () => {
      await render();

      const input = getInput();
      dispatchEvent(input, "input", "24.01.2000");
      expectChange("24.01.2000");

      dispatchEvent(input, "blur");
      expectCommit("24.01.2000");
    });

    it("emits value change on input & commit on blur, resetting value to null for invalid date", async () => {
      await render();

      const input = getInput();
      dispatchEvent(input, "input", "24.01");
      expectChange("24.01");
      expectNoCommit();

      dispatchEvent(input, "blur");
      expectCommit(null);
    });

    it("emits value change & commit on select", async () => {
      await render();

      const input = getInput();

      // Open datepicker
      input.click();

      // Select the 24.01.2000 in the datepicker dropdown
      const days = Array.from(
        element.querySelectorAll<HTMLElement>(
          "ngb-datepicker .ngb-dp-day .btn-light",
        ),
      );
      const day = days.find((day) => day.textContent?.trim() === "24");
      day?.click();

      expectChange("24.01.2000");
      expectCommit("24.01.2000");
    });
  });

  describe("yes/no", () => {
    beforeEach(() => {
      detail = build({
        VssDesignation: "Yes/no",
        VssTypeId: SubscriptionDetailType.YesNo,
        VssStyle: "TX",
        Value: "Ja",
      });
    });

    describe("checkbox", () => {
      beforeEach(() => {
        detail.ShowAsRadioButtons = false;
      });

      it("renders checkbox with label", async () => {
        await render();

        expectComponent("bkd-subscription-detail-yesno");
        expectLabel("Yes/no");

        const checkboxes = getCheckboxes();
        expect(checkboxes).toHaveSize(1);
        expect(checkboxes[0].checked).toBeTruthy();
      });

      it("renders initial value 'Nein'", async () => {
        detail.Value = "Nein";
        await render();

        const checkboxes = getCheckboxes();
        expect(checkboxes).toHaveSize(1);
        expect(checkboxes[0].checked).toBeFalsy();
      });

      it("renders checkbox without label", async () => {
        fixture.componentRef.setInput("hideLabel", true);
        await render();

        expectComponent("bkd-subscription-detail-yesno");
        expectNoLabel();

        const checkboxes = getCheckboxes();
        expect(checkboxes).toHaveSize(1);
        expect(checkboxes[0].checked).toBeTruthy();
      });

      it("emits value change & commit on change", async () => {
        await render();

        const [checkbox] = getCheckboxes();
        checkbox.click();
        expectChange("Nein");
        expectCommit("Nein");

        resetCommit();
        checkbox.click();
        expectChange("Ja");
        expectCommit("Ja");
      });
    });

    describe("radios", () => {
      beforeEach(() => {
        detail.ShowAsRadioButtons = true;
      });

      it("renders radios with label", async () => {
        await render();

        expectComponent("bkd-subscription-detail-yesno");
        expectLabel("Yes/no");

        const radios = getRadios();
        expect(
          radios.map((radio) => ({
            label: (radio.labels ?? [])[0]?.textContent?.trim(),
            checked: radio.checked,
          })),
        ).toEqual([
          { label: "evaluation.values.yes", checked: true },
          { label: "evaluation.values.no", checked: false },
        ]);
      });

      it("renders initial value 'Nein'", async () => {
        detail.Value = "Nein";
        await render();

        const radios = getRadios();
        expect(
          radios.map((radio) => ({
            label: (radio.labels ?? [])[0]?.textContent?.trim(),
            checked: radio.checked,
          })),
        ).toEqual([
          { label: "evaluation.values.yes", checked: false },
          { label: "evaluation.values.no", checked: true },
        ]);
      });

      it("renders checkbox without label", async () => {
        fixture.componentRef.setInput("hideLabel", true);
        await render();

        expectComponent("bkd-subscription-detail-yesno");
        const labels = Array.from(element.querySelectorAll("label"));
        expect(labels).toHaveSize(2);

        const radios = getRadios();
        expect(
          radios.map((radio) => ({
            label: (radio.labels ?? [])[0]?.textContent?.trim(),
            checked: radio.checked,
          })),
        ).toEqual([
          { label: "evaluation.values.yes", checked: true },
          { label: "evaluation.values.no", checked: false },
        ]);
      });

      it("emits value change & commit on change", async () => {
        await render();

        const radios = getRadios();
        radios[1].click();
        expectChange("Nein");
        expectCommit("Nein");

        resetCommit();
        radios[0].click();
        expectChange("Ja");
        expectCommit("Ja");
      });
    });
  });

  describe("yes", () => {
    beforeEach(() => {
      detail = build({
        VssDesignation: "Yes",
        VssTypeId: SubscriptionDetailType.Yes,
        VssStyle: "TX",
        Value: "Ja",
      });
    });

    it("renders checkbox with label", async () => {
      await render();

      expectComponent("bkd-subscription-detail-yesno");
      expectLabel("Yes");

      const checkboxes = getCheckboxes();
      expect(checkboxes).toHaveSize(1);
      expect(checkboxes[0].checked).toBeTruthy();
    });

    it("renders initial value null", async () => {
      detail.Value = null;
      await render();

      const checkboxes = getCheckboxes();
      expect(checkboxes).toHaveSize(1);
      expect(checkboxes[0].checked).toBeFalsy();
    });

    it("renders checkbox without label", async () => {
      fixture.componentRef.setInput("hideLabel", true);
      await render();

      expectComponent("bkd-subscription-detail-yesno");
      expectNoLabel();

      const checkboxes = getCheckboxes();
      expect(checkboxes).toHaveSize(1);
      expect(checkboxes[0].checked).toBeTruthy();
    });

    it("emits value change & commit on change", async () => {
      await render();

      const [checkbox] = getCheckboxes();
      checkbox.click();
      expectChange(null);
      expectCommit(null);

      resetCommit();
      checkbox.click();
      expectChange("Ja");
      expectCommit("Ja");
    });
  });

  describe("listbox", () => {
    beforeEach(() => {
      detail = build({
        VssDesignation: "Listbox",
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

        expectComponent("bkd-subscription-detail-listbox");
        expectLabel("Listbox");

        const select = getSelect();
        expect(select.value).toBe("2");

        const options = getSelectOptions();
        expect(options.map((o) => o.textContent?.trim())).toEqual([
          "",
          "Apple",
          "Pear",
        ]);
      });

      it("renders select without label", async () => {
        fixture.componentRef.setInput("hideLabel", true);
        await render();

        expectComponent("bkd-subscription-detail-listbox");
        expectNoLabel();

        const select = getSelect();
        expect(select.value).toBe("2");

        const options = getSelectOptions();
        expect(options.map((o) => o.textContent?.trim())).toEqual([
          "",
          "Apple",
          "Pear",
        ]);
      });

      it("emits value change & commit on change", async () => {
        await render();

        const select = getSelect();
        dispatchEvent(select, "change", "1");
        expectChange("1");
        expectCommit("1");
      });
    });

    describe("radios", () => {
      beforeEach(() => {
        detail.ShowAsRadioButtons = true;
      });

      it("renders radio buttons with label", async () => {
        await render();

        expectComponent("bkd-subscription-detail-listbox");
        expectLabel("Listbox");

        const radios = getRadios();
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

        expectComponent("bkd-subscription-detail-listbox");
        const labels = Array.from(element.querySelectorAll("label"));
        expect(labels).toHaveSize(2);

        const radios = getRadios();
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
        await render();

        const radios = getRadios();
        radios[0].click();
        expectChange("1");
        expectCommit("1");
      });
    });
  });

  describe("combobox", () => {
    beforeEach(() => {
      detail = build({
        VssDesignation: "Combobox",
        VssStyle: "CB",
        DropdownItems: [
          { Key: "Grape", Value: "Grape", IsActive: true },
          { Key: "Grapefruit", Value: "Grapefruit", IsActive: true },
          {
            Key: "Grapefruit juice",
            Value: "Grapefruit juice",
            IsActive: false,
          },
        ],
        Value: "Strawberry",
      });
    });

    it("renders text field with label", async () => {
      await render();

      expectComponent("bkd-subscription-detail-combobox");
      expectLabel("Combobox");

      const input = getInput();
      expect(input.type).toBe("text");
      expect(input.value).toBe("Strawberry");
    });

    it("renders text field without label", async () => {
      fixture.componentRef.setInput("hideLabel", true);
      await render();

      expectComponent("bkd-subscription-detail-combobox");
      expectNoLabel();

      const input = getInput();
      expect(input.type).toBe("text");
      expect(input.value).toBe("Strawberry");
    });

    it("emits value change on input & commit on blur", async () => {
      await render();

      const input = getInput();
      dispatchEvent(input, "input", "Cherry");
      expectChange("Cherry");
      expectNoCommit();

      dispatchEvent(input, "blur");
      expectCommit("Cherry");
    });

    it("displays typeahead suggestions & emits value change & commit on select", async () => {
      await render();

      const input = getInput();

      // Type something to trigger typeahead dropdown
      dispatchEvent(input, "input", "grape");

      // Typeahead displays suggestions, matching case insensitive
      const suggestions = Array.from(
        element.querySelectorAll<HTMLButtonElement>(
          "ngb-typeahead-window button",
        ),
      );
      expect(suggestions.map((c) => c.textContent?.trim())).toEqual([
        "Grape",
        "Grapefruit",
      ]);

      // Choose value from typeahead list
      suggestions[1].click();
      expectChange("Grapefruit");
      expectCommit("Grapefruit");
    });
  });

  function expectComponent(selector: string): void {
    expect(element.querySelector(selector)).not.toBeNull();
  }

  function expectLabel(text: string): void {
    const label = element.querySelector("label");
    expect(label?.textContent).toContain(text);
  }

  function expectNoLabel(): void {
    expect(element.querySelector("label")).toBeNull();
  }

  function expectChange(value: SubscriptionDetail["Value"]): void {
    expect(component.value()).toBe(value);
  }

  function expectCommit(value: SubscriptionDetail["Value"]): void {
    expect(component.value()).toBe(value);

    expect(commitCallback).toHaveBeenCalledTimes(1);
    expect(commitCallback.calls.mostRecent().args[0]).toEqual(value);
  }

  function expectNoCommit(): void {
    expect(commitCallback).not.toHaveBeenCalled();
  }

  function resetCommit(): void {
    commitCallback.calls.reset();
  }

  function getInput(): HTMLInputElement {
    const input = element.querySelector("input");
    expect(input).not.toBeNull();
    return input!;
  }

  function getTextarea(): HTMLTextAreaElement {
    const textarea = element.querySelector("textarea");
    expect(textarea).not.toBeNull();
    return textarea!;
  }

  function getSelect(): HTMLSelectElement {
    const select = element.querySelector("select");
    expect(select).not.toBeNull();
    return select!;
  }

  function getSelectOptions(): ReadonlyArray<HTMLOptionElement> {
    return Array.from(element.querySelectorAll("select option"));
  }

  function getRadios(): ReadonlyArray<HTMLInputElement> {
    return Array.from(element.querySelectorAll("input[type='radio']"));
  }

  function getCheckboxes(): ReadonlyArray<HTMLInputElement> {
    return Array.from(element.querySelectorAll("input[type='checkbox']"));
  }

  async function render() {
    fixture.componentRef.setInput("detail", detail);
    fixture.componentRef.setInput("value", detail.Value);
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
