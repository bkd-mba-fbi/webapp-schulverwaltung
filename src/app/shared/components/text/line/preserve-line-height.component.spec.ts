import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { PreserveLineHeightComponent } from "./preserve-line-height.component";

describe("LineComponent", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
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
      .query(By.css("bkd-preserve-line-height"))
      .query(By.css("div")).nativeElement.innerHTML;
  }
});

@Component({
  selector: "bkd-test",
  template: ` <bkd-preserve-line-height
    >content-projection</bkd-preserve-line-height
  >`,
  imports: [PreserveLineHeightComponent],
})
class TestComponent {}

@Component({
  selector: "bkd-test-with-null-content",
  template: ` <bkd-preserve-line-height>{{ null }}</bkd-preserve-line-height>`,
  imports: [PreserveLineHeightComponent],
})
class TestWithNullContentComponent {}
