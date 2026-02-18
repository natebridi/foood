"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [saving, setSaving] = useState(false);

  function setField(field: keyof RecipeData, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const res = await fetch("/admin/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
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
      }),
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
    if (res.ok) router.push("/admin/edit");
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box component="form" onSubmit={handleSave}>
        <Stack spacing={3}>
          {!isNew && (
            <TextField
              label="Notes"
              value={form.notes}
              onChange={(e) => setField("notes", e.target.value)}
              multiline
              minRows={2}
              fullWidth
            />
          )}

          <TextField
            label="Title"
            value={form.title}
            onChange={(e) => setField("title", e.target.value)}
            fullWidth
            required
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Servings"
              value={form.servings}
              onChange={(e) => setField("servings", e.target.value)}
              sx={{ flex: 1 }}
            />
            <TextField
              label="Total time"
              value={form.timetotal}
              onChange={(e) => setField("timetotal", e.target.value)}
              sx={{ flex: 1 }}
            />
            <TextField
              label="Active time"
              value={form.timeactive}
              onChange={(e) => setField("timeactive", e.target.value)}
              sx={{ flex: 1 }}
            />
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Ingredients
            </Typography>
            <IngredientEditor
              value={form.ingredients}
              onChange={(v) => setForm((f) => ({ ...f, ingredients: v }))}
            />
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Steps
            </Typography>
            <ArrayEditor
              name="steps"
              value={form.steps}
              onChange={(v) => setForm((f) => ({ ...f, steps: v }))}
            />
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Tags
            </Typography>
            <ArrayEditor
              name="tags"
              value={form.tags}
              onChange={(v) => setForm((f) => ({ ...f, tags: v }))}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Source name"
              value={form.sourcename}
              onChange={(e) => setField("sourcename", e.target.value)}
              sx={{ flex: 1 }}
            />
            <TextField
              label="Source URL"
              value={form.sourceurl}
              onChange={(e) => setField("sourceurl", e.target.value)}
              sx={{ flex: 2 }}
            />
          </Box>

          {isNew && (
            <TextField
              label="Notes"
              value={form.notes}
              onChange={(e) => setField("notes", e.target.value)}
              multiline
              minRows={2}
              fullWidth
            />
          )}

          <Divider />

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {!isNew && (
              <Button
                variant="outlined"
                color="error"
                onClick={() => setShowDeleteDialog(true)}
              >
                Delete
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              disabled={saving}
              sx={{ ml: "auto" }}
            >
              {saving ? "Saving…" : isNew ? "Save new recipe" : "Update recipe"}
            </Button>
          </Box>
        </Stack>
      </Box>

      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogTitle>Delete this recipe?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
