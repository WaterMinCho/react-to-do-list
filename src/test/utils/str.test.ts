import { isInitialMatch } from "../../utils/str";

describe("isInitialMatch", () => {
  const testCases = [
    { input: "팔도넨", expected: ["팔도네넴띤", "팔도넨넨면"] },
    { input: "팔도네네", expected: ["팔도네넴띤"] },
    { input: "팔도넨넨", expected: ["팔도넨넨면"] },
    { input: "팔도ㄴ", expected: ["팔도네넴띤", "팔도넨넨면"] },
    { input: "도네", expected: ["팔도네넴띤", "팔도넨넨면"] },
    { input: "네넴", expected: ["팔도네넴띤"] },
    { input: "네네", expected: ["팔도네넴띤"] },
    { input: "팔돈", expected: ["팔도네넴띤", "팔도넨넨면"] },
    { input: "팔도네넨", expected: [] },
    { input: "네넨", expected: [] },
    { input: "팔도넨넴", expected: [] },
  ];

  const targets = ["팔도네넴띤", "팔도넨넨면"];

  testCases.forEach(({ input, expected }) => {
    const result = targets.filter((target) => isInitialMatch(target, input));
    test(`"${input}"은(는) ${
      expected.length === 0
        ? "매칭되는게 없어야합니다."
        : `"${expected.join(", ")}"과 매칭돼야합니다.`
    } 결과값: ${result.length !== 0 ? `"${result}"` : "미매칭"}`, () => {
      expect(result).toEqual(expected);
    });
  });
});
