/**
 * useRAGHealthCareBotRecommendations - React Hook for RAGHealthCareBot Recommendations
 * 
 * Provides a convenient interface for fetching health test recommendations
 * based on patient symptoms.
 */

'use client';

import { useState, useCallback } from 'react';

export interface RAGHealthCareBotMatchedTest {
  name: string;
  parameters: string[];
  timeToResults: string;
  category: string;
}

export interface RAGHealthCareBotRecommendationResponse {
  symptoms: string;
  matchedTests: MatchedTest[];
  recommendations: string;
  nextSteps: string;
}

interface UseRAGHealthCareBotRecommendationsReturn {
  loading: boolean;
  error: string | null;
  data: RAGHealthCareBotRecommendationResponse | null;
  getRecommendations: (symptoms: string) => Promise<void>;
  reset: () => void;
}

export function useRAGHealthCareBotRecommendations(): UseRAGHealthCareBotRecommendationsReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RecommendationResponse | null>(null);

  const getRecommendations = useCallback(async (symptoms: string) => {
    if (!symptoms || symptoms.trim().length === 0) {
      setError('Please provide at least one symptom');
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch('/api/raghealthcarebot/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symptoms: symptoms.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Request failed with status ${response.status}`
        );
      }

      const result: RAGHealthCareBotRecommendationResponse = await response.json();
      setData(result);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    loading,
    error,
    data,
    getRecommendations,
    reset,
  };
}
