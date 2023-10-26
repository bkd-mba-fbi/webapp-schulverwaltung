import { XssPipe } from "./xss.pipe";

describe("XssPipe", () => {
  it("create an instance", () => {
    const pipe = new XssPipe();
    expect(pipe).toBeTruthy();
  });
});
