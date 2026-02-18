import { NextResponse } from "next/server";
import pool from "@/lib/db";
import type { RowDataPacket } from "mysql2";
import type { RecipeRow, Recipe } from "@/types/recipe";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM recipes WHERE id = ?",
    [id]
  );

  if (rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const row = rows[0] as RecipeRow;

  const recipe: Recipe = {
    id: row.id,
    title: row.title,
    servings: row.servings,
    time: { total: row.timetotal, active: row.timeactive },
    source: { name: row.sourcename, url: row.sourceurl },
    notes: row.notes ? row.notes.replace(/\n/g, "<br>") : "",
    ingredients: row.ingredients ? JSON.parse(row.ingredients) : [],
    steps: row.steps ? JSON.parse(row.steps) : [],
    tags: row.tags ? JSON.parse(row.tags) : [],
  };

  return NextResponse.json(recipe);
}
