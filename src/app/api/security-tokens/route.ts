import { NextResponse } from "next/server";
import {
  generateCsrfToken,
  generateJsToken,
  getRandomHoneypotName,
} from "@/lib/security";

export async function GET() {
  return NextResponse.json({
    csrfToken: generateCsrfToken(),
    jsToken: generateJsToken(),
    honeypotName: getRandomHoneypotName(),
  });
}
