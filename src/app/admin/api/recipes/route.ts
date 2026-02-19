import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { checkAuth } from "@/lib/auth";

export async function POST(req: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { action, id, title, steps, tags, ingredients, sourcename, sourceurl, servings, timetotal, timeactive, notes } = body;

  if (action === "delete") {
    await pool.query("DELETE FROM recipes WHERE id = $1", [id]);
    return NextResponse.json({ ok: true });
  }

  const fields = [title, steps, tags, ingredients, sourcename, sourceurl, servings, timetotal, timeactive, notes];

  if (action === "create") {
    const { rows } = await pool.query(
      `INSERT INTO recipes (title, steps, tags, ingredients, sourcename, sourceurl, servings, timetotal, timeactive, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id`,
      fields
    );
    return NextResponse.json({ ok: true, id: rows[0].id });
  }

  if (action === "update") {
    await pool.query(
      `UPDATE recipes
       SET title=$1, steps=$2, tags=$3, ingredients=$4, sourcename=$5, sourceurl=$6,
           servings=$7, timetotal=$8, timeactive=$9, notes=$10
       WHERE id=$11`,
      [...fields, id]
    );
    return NextResponse.json({ ok: true, id });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
