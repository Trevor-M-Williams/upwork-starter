import { ToolInvocation, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { getStockPrice } from "@/server/actions/financials";

interface Message {
  role: "user" | "assistant";
  content: string;
  toolInvocations?: ToolInvocation[];
}

export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json();

  const result = streamText({
    model: openai("gpt-4o"),
    system: "You are a helpful assistant.",
    messages,
    tools: {
      getStockPrice: {
        description: "Get the current stock price for a given ticker symbol",
        parameters: z.object({
          ticker: z
            .string()
            .describe("The stock ticker symbol (e.g., AAPL, GOOGL)"),
        }),
        execute: async ({ ticker }) => {
          console.log("execute getStockPrice");
          const price = await getStockPrice(ticker);
          return price;
        },
      },
    },
  });

  return result.toDataStreamResponse();
}
