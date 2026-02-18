import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { checkAuth } from "@/lib/auth";
import type { ResultSetHeader } from "mysql2";

export async function POST(req: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { action, id, title, steps, tags, ingredients, sourcename, sourceurl, servings, timetotal, timeactive, notes } = body;

  if (action === "delete") {
    await pool.query("DELETE FROM recipes WHERE id = ?", [id]);
    return NextResponse.json({ ok: true });
  }

  const fields = { title, steps, tags, ingredients, sourcename, sourceurl, servings, timetotal, timeactive, notes };

  if (action === "create") {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO recipes (title, steps, tags, ingredients, sourcename, sourceurl, servings, timetotal, timeactive, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [fields.title, fields.steps, fields.tags, fields.ingredients, fields.sourcename, fields.sourceurl, fields.servings, fields.timetotal, fields.timeactive, fields.notes]
    );
    return NextResponse.json({ ok: true, id: result.insertId });
  }

  if (action === "update") {
    await pool.query(
      `UPDATE recipes SET title=?, steps=?, tags=?, ingredients=?, sourcename=?, sourceurl=?, servings=?, timetotal=?, timeactive=?, notes=? WHERE id=?`,
      [fields.title, fields.steps, fields.tags, fields.ingredients, fields.sourcename, fields.sourceurl, fields.servings, fields.timetotal, fields.timeactive, fields.notes, id]
    );
    return NextResponse.json({ ok: true, id });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
