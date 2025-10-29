import { API_BASE_URL } from "./utils";

export interface QuestionPayload {
  id: number;
  text: string;
}

export interface ReflectionPayload {
  id: number;
  text: string;
}

export interface StatePayload {
  pending_question: QuestionPayload | null;
  last_reflection: ReflectionPayload | null;
  memories_count: number;
  state: {
    mood: string;
    curiosity: number;
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchState(): Promise<StatePayload> {
  const response = await fetch(`${API_BASE_URL}/api/state`, {
    cache: "no-store",
  });
  return handleResponse<StatePayload>(response);
}

export async function postReply(payload: {
  question_id: number;
  text: string;
}): Promise<StatePayload> {
  const response = await fetch(`${API_BASE_URL}/api/reply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<StatePayload>(response);
}
