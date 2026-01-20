import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiEndpoint = process.env.API_ENDPOINT;
    const apiKey = process.env.API_KEY;

    if (!apiEndpoint) {
      return NextResponse.json(
        { error: "API endpoint not configured" },
        { status: 500 }
      );
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (apiKey) {
      headers["Authorization"] = `Bearer ${apiKey}`;
    }

    const response = await fetch(apiEndpoint, {
      next: { revalidate: 0 },
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to fetch image: ${errorMessage}` },
      { status: 500 }
    );
  }
}

