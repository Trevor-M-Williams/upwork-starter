"use client";

import { useChat } from "ai/react";
import { Input } from "@/components/ui/input";
import { StockCard } from "./components/stock-card";

export default function Page() {
  const { messages, input, setInput, append } = useChat({
    api: "/api/chat",
    maxSteps: 5,
  });

  return (
    <div>
      <Input
        value={input}
        onChange={(event) => {
          setInput(event.target.value);
        }}
        onKeyDown={async (event) => {
          if (event.key === "Enter") {
            append({ content: input, role: "user" });
          }
        }}
      />

      {messages.map((m, index) => (
        <div key={index}>
          {m.content && (
            <>
              {m.role === "user" ? "User: " : "AI: "}
              <p>{m.content}</p>
            </>
          )}
          {m.toolInvocations?.map(
            (toolInvocation) =>
              toolInvocation.state === "result" && (
                <StockCard
                  ticker={toolInvocation.args.ticker}
                  price={toolInvocation.result || 125.05}
                  currency={"USD"}
                />
              ),
          )}
        </div>
      ))}
    </div>
  );
}
