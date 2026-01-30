import { NextResponse } from "next/server";

export function requireAdmin(req) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return { ok: false, res: NextResponse.json({ error: "ADMIN_PASSWORD_missing" }, { status: 500 }) };
  }

  const auth = req.headers.get("authorization") || "";
  const bearer = auth.toLowerCase().startsWith("bearer ") ? auth.slice(7) : null;
  const fallback = req.headers.get("x-admin-password");
  const provided = (bearer || fallback || "").trim();

  if (!provided || provided !== expected) {
    return { ok: false, res: NextResponse.json({ error: "unauthorized" }, { status: 401 }) };
  }

  return { ok: true };
}
