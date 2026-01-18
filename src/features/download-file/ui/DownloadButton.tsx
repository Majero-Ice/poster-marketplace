"use client";

import { useState } from "react";
import { Download, Loader2, Clock } from "lucide-react";
import { Button } from "@/shared/ui/button";

interface DownloadButtonProps {
  token: string;
}

export function DownloadButton({ token }: DownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/download/${token}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get download link");
      }

      const { downloadUrl, posterTitle } = await response.json();

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = posterTitle;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Download failed";
      setError(message);
      console.error("Download error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleDownload}
        disabled={isLoading}
        size="lg"
        className="w-full text-base"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Preparing download...
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            Download High-Resolution File
          </>
        )}
      </Button>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Clock className="w-3 h-3" />
        <span>Download link valid for 1 hour</span>
      </div>
    </div>
  );
}
