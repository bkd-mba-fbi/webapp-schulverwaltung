import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { PreserveLineHeightComponent } from "./preserve-line-height.component";

describe("LineComponent", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        TestWithNullContentComponent,
        PreserveLineHeightComponent,
      ],
    }).compileComponents();
  });

  it("should render content and append a non breaking space", () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    expect(content(fixture)).toContain("content-projection&nbsp;");
  });

  it("should render a non breaking space when property text is null", () => {
    const fixture = TestBed.createComponent(TestWithNullContentComponent);
    fixture.detectChanges();

    expect(content(fixture)).toEqual("&nbsp;");
  });

  function content(fixture: ComponentFixture<PreserveLineHeightComponent>) {
    return fixture.debugElement
      .query(By.css("erz-preserve-line-height"))
      .query(By.css("div")).nativeElement.innerHTML;
  }
});

@Component({
  selector: "erz-test",
  template: `<erz-preserve-line-height
    >content-projection</erz-preserve-line-height
  >`,
})
class TestComponent {}

@Component({
  selector: "erz-test-with-null-content",
  template: `<erz-preserve-line-height>{{ null }}</erz-preserve-line-height>`,
})
class TestWithNullContentComponent {}
