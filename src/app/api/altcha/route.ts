import { NextResponse } from "next/server";
import { createChallenge } from "altcha-lib";

export async function GET() {
  const hmacKey = process.env.ALTCHA_HMAC_KEY;
  if (!hmacKey) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  try {
    const challenge = await createChallenge({
      hmacKey,
      algorithm: "SHA-256",
      maxNumber: 100_000,
      expires: new Date(Date.now() + 30 * 60 * 1000), // 30 min
    });
    return NextResponse.json(challenge);
  } catch {
    return NextResponse.json(
      { error: "Challenge generation failed" },
      { status: 500 }
    );
  }
}
