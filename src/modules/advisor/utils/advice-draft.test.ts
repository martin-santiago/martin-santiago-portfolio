import { describe, expect, it } from "vitest";

import { toAdviceDraft } from "./advice-draft";

const ADVICE_JSON = JSON.stringify({
  summary: 'Mantén "RBLX".',
  recommendations: [{ symbol: "META", stance: "hold", agreesWithPlan: true, rationale: "Bien así" }],
});

const prefixUpTo = (marker: string) => ADVICE_JSON.slice(0, ADVICE_JSON.indexOf(marker) + marker.length);

describe("toAdviceDraft", () => {
  it("starts empty", () => {
    expect(toAdviceDraft("")).toEqual({ summary: "", recommendations: [] });
  });

  it("shows the summary while it is still being written", () => {
    expect(toAdviceDraft(prefixUpTo("Mant")).summary).toBe("Mant");
  });

  it("keeps the text when a chunk ends inside an escape sequence", () => {
    expect(toAdviceDraft(prefixUpTo('Mantén \\')).summary).toBe("Mantén ");
  });

  it("keeps a literal backslash when a chunk ends right after it", () => {
    expect(toAdviceDraft('{"summary":"C:\\\\').summary).toBe("C:\\");
  });

  it("never throws on text that is not a JSON prefix", () => {
    expect(toAdviceDraft(`${ADVICE_JSON}{"summary":"x`)).toEqual({ summary: "", recommendations: [] });
  });

  it("waits for symbol, stance and agreement before showing a recommendation", () => {
    expect(toAdviceDraft(prefixUpTo('"stance":"ho')).recommendations).toEqual([]);
    expect(toAdviceDraft(prefixUpTo("Bien")).recommendations).toEqual([
      { symbol: "META", stance: "hold", agreesWithPlan: true, rationale: "Bien" },
    ]);
  });

  it("returns the full advice once the JSON is complete", () => {
    expect(toAdviceDraft(ADVICE_JSON)).toEqual(JSON.parse(ADVICE_JSON));
  });
});
