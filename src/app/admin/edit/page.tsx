import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import pool from "@/lib/db";
import RecipeForm from "@/components/admin/RecipeForm";
import type { RowDataPacket } from "mysql2";
import type { RecipeRow, Ingredient } from "@/types/recipe";

async function getRecipes(): Promise<{ id: number; title: string }[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT id, title FROM recipes ORDER BY title"
  );
  return rows as { id: number; title: string }[];
}

async function getRecipe(id: string) {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM recipes WHERE id = ?",
    [id]
  );
  if (rows.length === 0) return null;
  return rows[0] as RecipeRow;
}

async function handleLogout(formData: FormData) {
  "use server";
  void formData;
  const cookieStore = await cookies();
  cookieStore.set("auth", "", { maxAge: 0, path: "/" });
  redirect("/admin/login");
}

function parseJsonColumn<T>(val: string, fallback: T): T {
  try {
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

export default async function EditPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const recipes = await getRecipes();

  let recipeData: {
    id: number;
    title: string;
    servings: string;
    timetotal: string;
    timeactive: string;
    sourcename: string;
    sourceurl: string;
    notes: string;
    ingredients: Ingredient[];
    steps: string[];
    tags: string[];
  };
  let isNew: boolean;

  if (id) {
    const row = await getRecipe(id);
    if (!row) redirect("/admin/edit");

    recipeData = {
      id: row.id,
      title: row.title ?? "",
      servings: row.servings ?? "",
      timetotal: row.timetotal ?? "",
      timeactive: row.timeactive ?? "",
      sourcename: row.sourcename ?? "",
      sourceurl: row.sourceurl ?? "",
      notes: row.notes ?? "",
      ingredients: parseJsonColumn<Ingredient[]>(row.ingredients, [{}] as Ingredient[]),
      steps: parseJsonColumn<string[]>(row.steps, [""]),
      tags: parseJsonColumn<string[]>(row.tags, [""]),
    };
    isNew = false;
  } else {
    recipeData = {
      id: -1,
      title: "",
      servings: "",
      timetotal: "",
      timeactive: "",
      sourcename: "",
      sourceurl: "",
      notes: "",
      ingredients: [{ quantity: "", measure: -1, name: "", preparation: "" }],
      steps: [""],
      tags: [""],
    };
    isNew = true;
  }

  return (
    <>
      <div className="main-nav">
        <div className="select-wrap">
          <select
            id="recipeSelect"
            defaultValue={id ?? ""}
            onChange={undefined}
          >
            <option value="">Add new recipe</option>
            {recipes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title}
              </option>
            ))}
          </select>
        </div>
        <form action={handleLogout}>
          <button
            type="submit"
            style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", margin: "0.5em 0", float: "right", font: "inherit" }}
          >
            Logout
          </button>
        </form>
      </div>

      <RecipeForm recipe={recipeData} isNew={isNew} />

      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.getElementById('recipeSelect').addEventListener('change', function() {
              var id = this.value;
              window.location.href = id ? '/admin/edit?id=' + id : '/admin/edit';
            });
          `,
        }}
      />
    </>
  );
}
