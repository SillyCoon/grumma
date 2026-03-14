import { mockGrammarPoint } from "../../__mocks__";
import { GrammarPoints } from ".";
import { describe, expect, test } from "vitest";

describe("GrammarPoint", () => {
  test("filters hidden for non-admin", () => {
    const grammarPoints = [
      mockGrammarPoint({ order: 1, hidden: false }),
      mockGrammarPoint({ order: 2, hidden: true }),
      mockGrammarPoint({ order: 3, hidden: false }),
      mockGrammarPoint({ order: 4, hidden: true }),
    ];

    const result = GrammarPoints.filterVisible(grammarPoints, {
      user: { role: "guest" },
    });
    expect(result).toEqual([grammarPoints[0], grammarPoints[2]]);
  });

  test("does not filter hidden for admin", () => {
    const grammarPoints = [
      mockGrammarPoint({ order: 1, hidden: false }),
      mockGrammarPoint({ order: 2, hidden: true }),
      mockGrammarPoint({ order: 3, hidden: false }),
      mockGrammarPoint({ order: 4, hidden: true }),
    ];

    const result = GrammarPoints.filterVisible(grammarPoints, {
      user: { role: "admin" },
    });
    expect(result).toEqual(grammarPoints);
  });
});
