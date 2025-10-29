"use client";

import { useEffect, useMemo, useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Skeleton } from "./ui/skeleton";
import type { QuestionPayload } from "../lib/api";

interface QuestionCardProps {
  question: QuestionPayload | null;
  onSubmit: (questionId: number, text: string) => Promise<void>;
  submitting: boolean;
}

export function QuestionCard({ question, onSubmit, submitting }: QuestionCardProps) {
  const [value, setValue] = useState("");
  const isDisabled = submitting || !question;

  useEffect(() => {
    setValue("");
  }, [question?.id]);

  const placeholder = useMemo(
    () =>
      question
        ? "Let the lifeform know what's on your mind..."
        : "Waiting for the next question...",
    [question],
  );

  async function handleSubmit() {
    if (!question || !value.trim()) return;
    await onSubmit(question.id, value.trim());
  }

  return (
    <Card className="backdrop-blur-sm bg-card/80">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-primary" />
            Current Prompt
          </CardTitle>
        </div>
        {submitting && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
      </CardHeader>
      <CardContent className="space-y-4">
        {question ? (
          <p className="text-base leading-relaxed text-muted-foreground">{question.text}</p>
        ) : (
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        )}
        <Textarea
          placeholder={placeholder}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          disabled={isDisabled}
          onKeyDown={(event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
              event.preventDefault();
              void handleSubmit();
            }
          }}
        />
        <p className="text-xs text-muted-foreground">
          Tip: Press Cmd/Ctrl + Enter to submit instantly.
        </p>
      </CardContent>
      <CardFooter className="justify-end">
        <Button disabled={isDisabled || !value.trim()} onClick={() => void handleSubmit()}>
          Send Reflection
        </Button>
      </CardFooter>
    </Card>
  );
}
