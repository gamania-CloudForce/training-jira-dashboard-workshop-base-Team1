import { useState, useEffect, useCallback } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

export interface SprintInfo {
  sprint_name: string;
  sprint_id: number;
  board_name: string;
  state: string;
  start_date: string | null;
  end_date: string | null;
  goal: string;
}

export interface SprintListResponse {
  sprints: SprintInfo[];
}

export function useSprintTimeline() {
  const [sprints, setSprints] = useState<SprintInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSprints = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/sprint/list`);
      if (!response.ok) {
        throw new Error(`Failed to fetch sprints: ${response.statusText}`);
      }

      const data: SprintListResponse = await response.json();
      setSprints(data.sprints || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while fetching sprints";
      setError(errorMessage);
      setSprints([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSprints();
  }, [fetchSprints]);

  return {
    sprints,
    loading,
    error,
    refetch: fetchSprints,
  };
}
