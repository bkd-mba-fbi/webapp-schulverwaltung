import { Injectable } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { SelectionService } from "./selection.service";

describe("SelectionService", () => {
  let service: FooService;
  let selectionCallback: jasmine.Spy;
  const item1: Foo = { id: 1 };
  const item2: Foo = { id: 1 };
  const item3: Foo = { id: 1 };

  interface Foo {
    id: number;
  }

  @Injectable()
  class FooService extends SelectionService<Foo> {}

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [FooService] });
    service = TestBed.inject(FooService);

    selectionCallback = jasmine.createSpy("selection$");
    service.selection$.subscribe(selectionCallback);
  });

  it("initially emits an empty array", () => {
    expect(selectionCallback).toHaveBeenCalledWith([]);
  });

  describe(".toggle", () => {
    it("adds item to selection if not already selected, removes it otherwise", () => {
      service.toggle(item1);
      expect(selectionCallback).toHaveBeenCalledWith([item1]);

      service.toggle(item2);
      expect(selectionCallback).toHaveBeenCalledWith([item1, item2]);

      service.toggle(item1);
      expect(selectionCallback).toHaveBeenCalledWith([item2]);
    });
  });

  describe(".clear", () => {
    it("it clears the current selection", () => {
      service.toggle(item1);
      service.toggle(item2);
      selectionCallback.calls.reset();

      service.clear();
      expect(selectionCallback).toHaveBeenCalledWith([]);
    });

    it("resets the selection to the given items", () => {
      service.toggle(item1);
      service.toggle(item2);
      selectionCallback.calls.reset();

      service.clear([item2, item3]);
      expect(selectionCallback).toHaveBeenCalledWith([item2, item3]);
    });
  });

  describe(".isSelected$", () => {
    it("emits true if item gets selected, false if it gets unselected", () => {
      const isSelected1Callback = jasmine.createSpy("isSelected$ 1");
      service.isSelected$(item1).subscribe(isSelected1Callback);

      const isSelected2Callback = jasmine.createSpy("isSelected$ 2");
      service.isSelected$(item2).subscribe(isSelected2Callback);

      expect(isSelected1Callback).toHaveBeenCalledWith(false);
      expect(isSelected2Callback).toHaveBeenCalledWith(false);

      isSelected1Callback.calls.reset();
      isSelected2Callback.calls.reset();
      service.toggle(item1);
      expect(isSelected1Callback).toHaveBeenCalledWith(true);
      expect(isSelected2Callback).not.toHaveBeenCalled();

      isSelected1Callback.calls.reset();
      service.toggle(item2);
      expect(isSelected1Callback).not.toHaveBeenCalled();
      expect(isSelected2Callback).toHaveBeenCalledWith(true);

      isSelected2Callback.calls.reset();
      service.toggle(item1);
      expect(isSelected1Callback).toHaveBeenCalledWith(false);
      expect(isSelected2Callback).not.toHaveBeenCalledWith();
    });
  });
});
