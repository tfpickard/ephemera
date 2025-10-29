"use client";

import { useMemo } from "react";
import { Flame, Brain, Clock } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import type { StatePayload } from "../lib/api";

interface StatePanelProps {
  state: StatePayload["state"] | null;
  memoriesCount: number | null;
  lastReflectedAt?: string | null;
}

export function StatePanel({ state, memoriesCount, lastReflectedAt }: StatePanelProps) {
  const curiosityLabel = useMemo(() => {
    if (!state) return "Loading";
    if (state.curiosity > 0.75) return "Vivid";
    if (state.curiosity > 0.5) return "Awake";
    if (state.curiosity > 0.25) return "Calibrating";
    return "Resting";
  }, [state]);

  return (
    <Card className="bg-card/80">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="h-5 w-5 text-primary" />
          Internal State
        </CardTitle>
        {state ? <Badge className="uppercase tracking-wide">{state.mood}</Badge> : <Skeleton className="h-6 w-24 rounded-full" />}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Curiosity</span>
            <span>{state ? `${Math.round(state.curiosity * 100)}% · ${curiosityLabel}` : "--"}</span>
          </div>
          <Progress value={(state?.curiosity ?? 0) * 100} />
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Flame className="h-4 w-4" />
          <span>
            Memories logged:
            <strong className="ml-1 text-foreground">{memoriesCount ?? "--"}</strong>
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>
            Last reflection:
            <strong className="ml-1 text-foreground">{lastReflectedAt ?? "Awaiting"}</strong>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
