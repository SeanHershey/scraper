"use client";

import Image from "next/image";
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
        throw new Error("Failed to fetch image");
      }
      const data: ApiResponse = await response.json();
      setImageData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImage();
  }, [fetchImage]);

  useEffect(() => {
    const handleKeyPress = () => {
      fetchImage();
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [fetchImage]);

  return (
    <div className="p-8 cursor-pointer" onClick={fetchImage}>
      <div className="text-3xl font-bold underline bg-neutral-900">scraper</div>
      <div className="bg-neutral-200 h-80 w-60 mx-auto mt-32 md:mt-[20vh] pt-5">
        <div className="bg-neutral-900 h-60 w-55 mx-auto relative">
          {loading && <div className="text-white"></div>}
          {error && <div className="text-red-500 text-sm p-2">{error}</div>}
          {imageData && !loading && (
            <Image
              key={imageData.image_url}
              src={imageData.image_url}
              alt={imageData.title}
              fill
              className="object-cover animate-fade-in"
              unoptimized
            />
          )}
        </div>
      </div>
      {imageData && (
        <div className="text-center mt-4">
          <p className="text-sm text-neutral-600">{imageData.title}</p>
          <p className="text-xs text-neutral-500">Query: {imageData.query}</p>
        </div>
      )}
    </div>
  );
}

