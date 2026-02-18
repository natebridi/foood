import { NextResponse } from "next/server";
import pool from "@/lib/db";
import type { RowDataPacket } from "mysql2";

export async function GET() {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT id, title FROM recipes ORDER BY title"
  );
  return NextResponse.json(rows);
}
