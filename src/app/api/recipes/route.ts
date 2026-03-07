import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const { rows } = await pool.query("SELECT id, title, slug, tags FROM recipes ORDER BY title");
  return NextResponse.json(
    rows.map((r) => ({
      ...r,
      tags: r.tags ? JSON.parse(r.tags) : [],
    }))
  );
}
