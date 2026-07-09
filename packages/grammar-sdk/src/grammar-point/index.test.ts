import { mockGrammarPoint } from "../../__mocks__";
import { GrammarPoints } from ".";
import { describe, expect, test } from "vitest";

describe("GrammarPoint", () => {
  test("filters hidden for non-admin", () => {
    const grammarPoints = [
      mockGrammarPoint({ order: 1, hide: false }),
      mockGrammarPoint({ order: 2, hide: true }),
      mockGrammarPoint({ order: 3, hide: false }),
      mockGrammarPoint({ order: 4, hide: true }),
    ];

    const result = GrammarPoints.filterVisible(grammarPoints, {
      user: { role: "guest" },
    });
    expect(result).toEqual([grammarPoints[0], grammarPoints[2]]);
  });

  test("does not filter hidden for admin", () => {
    const grammarPoints = [
      mockGrammarPoint({ order: 1, hide: false }),
      mockGrammarPoint({ order: 2, hide: true }),
      mockGrammarPoint({ order: 3, hide: false }),
      mockGrammarPoint({ order: 4, hide: true }),
    ];

    const result = GrammarPoints.filterVisible(grammarPoints, {
      user: { role: "admin", id: "1" },
    });
    expect(result).toEqual(grammarPoints);
  });
});
