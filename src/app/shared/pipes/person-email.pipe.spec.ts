import { PersonEmailPipe } from "./person-email.pipe";
import { buildPersonWithEmails } from "../../../spec-builders";

describe("PersonEmailPipe", () => {
  let personEmailPipe: PersonEmailPipe;

  beforeEach(() => {
    personEmailPipe = new PersonEmailPipe();
  });

  it("should return null for a person without any email set", () => {
    expect(personEmailPipe.transform(buildPersonWithEmails(12345))).toBeNull();
  });

  it("should return the first email address if all options have values", () => {
    expect(
      personEmailPipe.transform(
        buildPersonWithEmails(
          12345,
          "first@email.ch",
          "second@email.ch",
          "third@email.ch",
        ),
      ),
    ).toBe("first@email.ch");
  });

  it("should return the first email address with a value ", () => {
    expect(
      personEmailPipe.transform(
        buildPersonWithEmails(
          12345,
          undefined,
          "second@email.ch",
          "third@email.ch",
        ),
      ),
    ).toBe("second@email.ch");
  });

  it("should return the email address with a value - email", () => {
    expect(
      personEmailPipe.transform(
        buildPersonWithEmails(12345, undefined, "second@email.ch", undefined),
      ),
    ).toBe("second@email.ch");
  });

  it("should return the first email address with a value - email2", () => {
    expect(
      personEmailPipe.transform(
        buildPersonWithEmails(12345, undefined, undefined, "third@email.ch"),
      ),
    ).toBe("third@email.ch");
  });
});
