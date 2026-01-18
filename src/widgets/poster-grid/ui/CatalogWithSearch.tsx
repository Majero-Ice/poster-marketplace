"use client";

import type { Poster } from "@/entities/poster/model/types";
import { PosterGrid } from "./PosterGrid";
import { SearchBar } from "@/widgets/search-bar";
import { useSearch } from "@/features/search-posters";
import { Badge } from "@/shared/ui/badge";
import { Search } from "lucide-react";

interface CatalogWithSearchProps {
  initialPosters: Poster[];
}

export function CatalogWithSearch({ initialPosters }: CatalogWithSearchProps) {
  const { query, setQuery, results, isSearching, hasSearched, clearSearch } =
    useSearch();

  const displayPosters = query ? results : initialPosters;
  const showNoResults = hasSearched && query && results.length === 0;

  return (
    <div className="space-y-8">
      <div className="max-w-2xl mx-auto">
        <SearchBar
          query={query}
          onQueryChange={setQuery}
          onClear={clearSearch}
          isSearching={isSearching}
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">
            {query ? "Search Results" : "Featured Collection"}
          </h2>
          <p className="text-muted-foreground">
            {query
              ? `Found ${displayPosters.length} ${
                  displayPosters.length === 1 ? "artwork" : "artworks"
                } matching "${query}"`
              : "Explore our handpicked selection of digital masterpieces"}
          </p>
        </div>
        {!query && (
          <Badge variant="outline">{displayPosters.length} artworks</Badge>
        )}
      </div>

      {showNoResults ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-muted p-6 mb-4">
            <Search className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-semibold mb-2">No results found</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            We couldn't find any posters matching "{query}". Try searching with
            different keywords or browse all available artworks.
          </p>
        </div>
      ) : (
        <PosterGrid posters={displayPosters} />
      )}
    </div>
  );
}
