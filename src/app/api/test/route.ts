import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json();

  const personasEndpoint = process.env.PERSONAS_ENDPOINT;
  if (!personasEndpoint) {
    return NextResponse.json(
      { error: "PERSONAS_ENDPOINT is not set" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(personasEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to call persona endpoint" },
      { status: 500 }
    );
  }
}
