import { describe, expect, it, vi } from "vitest";

import type { PortfolioAdviceDto } from "../dtos/portfolio-advice.dto";
import { readAdviceStream } from "./advice-stream";

const ADVICE = { summary: "Ok", recommendations: [] };

async function* adviceUpdates(...updates: PortfolioAdviceDto[]): AsyncGenerator<PortfolioAdviceDto> {
  yield* updates;
}

async function* brokenAdviceUpdates(): AsyncGenerator<PortfolioAdviceDto> {
  yield { status: "writing", text: '{"sum' };
  throw new Error("Connection closed.");
}

describe("readAdviceStream", () => {
  it("accumulates the written text and ends with the advice", async () => {
    const onWriting = vi.fn();
    const stream = adviceUpdates(
      { status: "writing", text: '{"sum' },
      { status: "writing", text: 'mary"' },
      { status: "ok", advice: ADVICE },
    );

    await expect(readAdviceStream(Promise.resolve(stream), onWriting)).resolves.toEqual({ status: "ok", advice: ADVICE });
    expect(onWriting.mock.calls).toEqual([['{"sum'], ['{"summary"']]);
  });

  it("starts the text over when the answer restarts", async () => {
    const onWriting = vi.fn();
    const stream = adviceUpdates(
      { status: "writing", text: '{"summ' },
      { status: "restarted" },
      { status: "writing", text: "{" },
      { status: "ok", advice: ADVICE },
    );

    await readAdviceStream(Promise.resolve(stream), onWriting);
    expect(onWriting.mock.lastCall).toEqual(["{"]);
  });

  it("turns a dropped connection or a rejected request into advice-failed", async () => {
    const failed = { status: "error", reason: "advice-failed" };
    await expect(readAdviceStream(Promise.resolve(brokenAdviceUpdates()), vi.fn())).resolves.toEqual(failed);
    await expect(readAdviceStream(Promise.reject(new Error("Unknown action")), vi.fn())).resolves.toEqual(failed);
  });
});
