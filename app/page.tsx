"use client";

import { useCallback, useEffect, useState } from "react";

interface ApiResponse {
  query: string;
  image_url: string;
  title: string;
  thumbnail: string;
}

export default function Home() {
  const [imageData, setImageData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImage = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/image");
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
        throw new Error(errorData.error || `Failed to fetch image: ${response.status}`);
      }
      const data: ApiResponse = await response.json();
      console.log("API Response:", data);
      if (!data.image_url) {
        throw new Error("No image_url in API response");
      }
      setImageData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      console.error("Error fetching image:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImage();
  }, [fetchImage]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Prevent default only for specific keys that might interfere
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
      }
      fetchImage();
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [fetchImage]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    fetchImage();
  }, [fetchImage]);

  return (
    <div className="p-8 cursor-pointer min-h-screen" onClick={handleClick}>
      <div className="text-3xl font-bold underline bg-neutral-900">scraper</div>
      <div className="bg-neutral-200 h-80 w-60 mx-auto mt-32 md:mt-[20vh] pt-5">
        <div className="bg-neutral-900 h-60 w-55 mx-auto relative" onClick={handleClick}>
          {loading && <div className="text-white"></div>}
          {error && (
            <div className="text-red-500 text-sm p-2 text-center">
              {error}
            </div>
          )}
          {imageData && !loading && imageData.image_url && (
            <img
              key={imageData.image_url}
              src={imageData.image_url}
              alt={imageData.title}
              className="absolute inset-0 w-full h-full object-cover animate-fade-in pointer-events-none"
              onError={(e) => {
                console.error("Image failed to load:", imageData.image_url);
                setError("Failed to load image");
              }}
            />
          )}
        </div>
      </div>
      {imageData && (
        <div className="text-center mt-4" onClick={handleClick}>
          <p className="text-sm text-neutral-600">{imageData.title}</p>
          <p className="text-xs text-neutral-500">Query: {imageData.query}</p>
        </div>
      )}
    </div>
  );
}

