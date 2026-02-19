import { notFound } from "next/navigation";
import pool from "@/lib/db";
import IndexCard from "@/components/IndexCard";
import type { RecipeRow, Recipe } from "@/types/recipe";
import "./../recipes.css";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { rows } = await pool.query("SELECT title FROM recipes WHERE slug = $1", [slug]);
  if (!rows.length) return {};
  return { title: rows[0].title };
}

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { rows } = await pool.query("SELECT * FROM recipes WHERE slug = $1", [slug]);
  if (!rows.length) notFound();

  const row = rows[0] as RecipeRow;
  const recipe: Recipe = {
    id: row.id,
    title: row.title,
    slug: row.slug,
    servings: row.servings,
    time: { total: row.timetotal, active: row.timeactive },
    source: { name: row.sourcename, url: row.sourceurl },
    notes: row.notes ? row.notes.replace(/\n/g, "<br>") : "",
    ingredients: row.ingredients ? JSON.parse(row.ingredients) : [],
    steps: row.steps ? JSON.parse(row.steps) : [],
    tags: row.tags ? JSON.parse(row.tags) : [],
  };

  return (
    <div className="card-wrap">
      <IndexCard recipe={recipe} />
    </div>
  );
}
