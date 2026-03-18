import { add } from "./example";

describe("add", () => {
  it("adds numbers", () => {
    expect(add(1, 2)).toBe(3);
  });
});
