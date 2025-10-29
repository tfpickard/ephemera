"use client";

import { NotebookText, MessageSquare } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import type { ReflectionPayload } from "../lib/api";

interface HistoryListProps {
  lastReflection: ReflectionPayload | null;
  memoriesCount: number | null;
}

export function HistoryList({ lastReflection, memoriesCount }: HistoryListProps) {
  return (
    <Card className="bg-card/80">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg">
          <NotebookText className="h-5 w-5 text-primary" />
          Recent Reflection
        </CardTitle>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MessageSquare className="h-4 w-4" />
          <span>{memoriesCount != null ? `${memoriesCount} memories` : "--"}</span>
        </div>
      </CardHeader>
      <CardContent>
        {lastReflection ? (
          <p className="leading-relaxed text-muted-foreground">{lastReflection.text}</p>
        ) : (
          <div className="space-y-2">
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
