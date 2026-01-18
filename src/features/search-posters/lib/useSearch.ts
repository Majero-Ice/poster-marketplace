import { useState, useEffect } from "react";
import { Poster } from "@/entities/poster";

export function useSearch() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<Poster[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    const fetchResults = async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `/api/posters/search?q=${encodeURIComponent(debouncedQuery)}`
        );
        const data = await response.json();
        setResults(data.posters || []);
        setHasSearched(true);
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  const clearSearch = () => {
    setQuery("");
    setDebouncedQuery("");
    setResults([]);
    setHasSearched(false);
  };

  return {
    query,
    setQuery,
    results,
    isSearching,
    hasSearched,
    clearSearch,
  };
}
