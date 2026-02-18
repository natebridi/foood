"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import IngredientEditor from "./IngredientEditor";
import ArrayEditor from "./ArrayEditor";
import type { Ingredient } from "@/types/recipe";

interface RecipeData {
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
}

interface Props {
  recipe: RecipeData;
  isNew: boolean;
}

export default function RecipeForm({ recipe, isNew }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<RecipeData>(recipe);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  function setField(field: keyof RecipeData, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const body = {
      action: isNew ? "create" : "update",
      id: form.id,
      title: form.title,
      servings: form.servings,
      timetotal: form.timetotal,
      timeactive: form.timeactive,
      sourcename: form.sourcename,
      sourceurl: form.sourceurl,
      notes: form.notes,
      ingredients: JSON.stringify(form.ingredients),
      steps: JSON.stringify(form.steps),
      tags: JSON.stringify(form.tags),
    };

    const res = await fetch("/admin/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const data = await res.json();
      router.push(`/admin/edit?id=${data.id}`);
    }
    setSaving(false);
  }

  async function handleDelete() {
    const res = await fetch("/admin/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id: form.id }),
    });
    if (res.ok) {
      router.push("/admin/edit");
    }
  }

  return (
    <div className="form-wrap">
      <form onSubmit={handleSave}>
        {!isNew && (
          <div className="row">
            <label>Notes</label>
            <div className="textarea-wrap">
              <textarea
                name="notes"
                value={form.notes}
                onChange={(e) => setField("notes", e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="row">
          <label>Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setField("title", e.target.value)}
          />
        </div>

        <div className="row split">
          <div className="group">
            <label>Servings</label>
            <input
              type="text"
              value={form.servings}
              onChange={(e) => setField("servings", e.target.value)}
            />
          </div>
          <div className="group">
            <label>Time</label>
            <div className="two-inputs">
              <input
                type="text"
                value={form.timetotal}
                onChange={(e) => setField("timetotal", e.target.value)}
                placeholder="Total"
              />
              <input
                type="text"
                value={form.timeactive}
                onChange={(e) => setField("timeactive", e.target.value)}
                placeholder="Active"
              />
            </div>
          </div>
        </div>

        <div className="row">
          <label>Ingredients</label>
          <IngredientEditor
            value={form.ingredients}
            onChange={(v) => setForm((f) => ({ ...f, ingredients: v }))}
          />
        </div>

        <div className="row">
          <label>Steps</label>
          <ArrayEditor
            name="steps"
            value={form.steps}
            onChange={(v) => setForm((f) => ({ ...f, steps: v }))}
          />
        </div>

        <div className="row">
          <label>Tags</label>
          <ArrayEditor
            name="tags"
            value={form.tags}
            onChange={(v) => setForm((f) => ({ ...f, tags: v }))}
          />
        </div>

        <div className="row">
          <label>Source</label>
          <div className="two-inputs">
            <input
              type="text"
              value={form.sourcename}
              onChange={(e) => setField("sourcename", e.target.value)}
              placeholder="Name"
            />
            <input
              type="text"
              value={form.sourceurl}
              onChange={(e) => setField("sourceurl", e.target.value)}
              placeholder="URL"
            />
          </div>
        </div>

        {isNew && (
          <div className="row">
            <label>Notes</label>
            <div className="textarea-wrap">
              <textarea
                value={form.notes}
                onChange={(e) => setField("notes", e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="submit row">
          {isNew ? (
            <input type="submit" value={saving ? "Saving…" : "Save new recipe"} disabled={saving} />
          ) : (
            <>
              <div className="fake-delete" onClick={() => setShowDeleteConfirm(true)}>Delete</div>
              {showDeleteConfirm && (
                <div className="delete-wrap" style={{ display: "block" }}>
                  Sure?
                  <button type="button" className="delete" onClick={handleDelete} style={{ border: "1px solid #f00", background: "transparent", color: "#f00", borderRadius: 3, padding: "0.5em 1em", margin: "0 1em", cursor: "pointer" }}>
                    Yes, delete
                  </button>
                  <span className="cancel" style={{ cursor: "pointer" }} onClick={() => setShowDeleteConfirm(false)}>Cancel</span>
                </div>
              )}
              <input type="submit" value={saving ? "Saving…" : "Update recipe"} disabled={saving} />
            </>
          )}
        </div>
      </form>
    </div>
  );
}
