"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCcw } from "lucide-react";

import { QuestionCard } from "../components/QuestionCard";
import { StatePanel } from "../components/StatePanel";
import { HistoryList } from "../components/HistoryList";
import { fetchState, postReply, type StatePayload } from "../lib/api";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

export default function HomePage() {
  const [data, setData] = useState<StatePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadState = useCallback(async () => {
    try {
      setError(null);
      const payload = await fetchState();
      setData(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load state");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadState();
    const timer = setInterval(() => {
      void loadState();
    }, 45_000);
    return () => clearInterval(timer);
  }, [loadState]);

  const handleSubmit = useCallback(
    async (questionId: number, text: string) => {
      setSubmitting(true);
      try {
        const payload = await postReply({ question_id: questionId, text });
        setData(payload);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to submit reply");
      } finally {
        setSubmitting(false);
      }
    },
    [],
  );

  const pendingQuestion = data?.pending_question ?? null;
  const lastReflection = data?.last_reflection ?? null;
  const state = data?.state ?? null;
  const memoriesCount = data?.memories_count ?? null;

  const statusMessage = useMemo(() => {
    if (error) return error;
    if (loading) return "Synchronizing with the lifeform...";
    if (submitting) return "Breathing in your reply...";
    return "Connected";
  }, [error, loading, submitting]);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <header className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">AI Lifeform</h1>
        <p className="text-muted-foreground">
          Participate in a gentle metabolism loop that learns from your reflections and subtly
          reshapes its internal state.
        </p>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className={error ? "text-red-500" : "text-muted-foreground"}>{statusMessage}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setLoading(true);
              void loadState();
            }}
            className="gap-2"
            disabled={submitting}
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </header>

      <main className="grid grid-cols-1 gap-6 md:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <QuestionCard question={pendingQuestion} onSubmit={handleSubmit} submitting={submitting} />
          <HistoryList lastReflection={lastReflection} memoriesCount={memoriesCount} />
        </div>
        <div className="space-y-6">
          <StatePanel
            state={state}
            memoriesCount={memoriesCount}
            lastReflectedAt={lastReflection ? `Reflection #${lastReflection.id}` : null}
          />
          <Card className="bg-card/80">
            <CardContent className="space-y-3 p-6 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">How it works</p>
              <ol className="list-decimal space-y-2 pl-5">
                <li>The lifeform generates a question when none is pending.</li>
                <li>You respond, creating a new memory in its archive.</li>
                <li>It reflects on your words and tunes its mood & curiosity.</li>
                <li>A scheduler nudges it to ask again, keeping the loop alive.</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
