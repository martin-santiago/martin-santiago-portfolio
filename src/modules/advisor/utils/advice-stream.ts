import type { PortfolioAdviceDto } from "../dtos/portfolio-advice.dto";

export type AdviceResult = Extract<PortfolioAdviceDto, { status: "ok" | "error" }>;

const FAILED_ADVICE: AdviceResult = { status: "error", reason: "advice-failed" };

export async function readAdviceStream(
  adviceStream: Promise<AsyncIterable<PortfolioAdviceDto>>,
  onWriting: (adviceJson: string) => void,
): Promise<AdviceResult> {
  let adviceJson = "";
  try {
    for await (const adviceUpdate of await adviceStream) {
      if (adviceUpdate.status === "ok" || adviceUpdate.status === "error") return adviceUpdate;
      adviceJson = adviceUpdate.status === "restarted" ? "" : adviceJson + adviceUpdate.text;
      onWriting(adviceJson);
    }
  } catch (error) {
    console.error(error);
  }
  return FAILED_ADVICE;
}
