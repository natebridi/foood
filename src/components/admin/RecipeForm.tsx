"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import IngredientEditor from "./IngredientEditor";
import ArrayEditor from "./ArrayEditor";
import type { Ingredient } from "@/types/recipe";
import Alert from "@mui/material/Alert";

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
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  function setField(field: keyof RecipeData, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    scrollTo(0, 0);

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
      setShowSuccessMessage(true);
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
      {showSuccessMessage && (
        <Alert icon={<CheckIcon />} variant="filled" severity="success" onClose={() => setShowSuccessMessage(false)} sx={{ mb: 3 }}>
          Recipe saved successfully
        </Alert>
      )}
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
            variant="standard"
            onChange={(e) => setField("title", e.target.value)}
            fullWidth
            required
            sx={{ input: { fontSize: "1.5rem", fontWeight: 500 } }}
          />

          <Stack direction={{xs: "column", sm: "row"}} spacing={2}>
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
          </Stack>

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

          <Stack direction="row" justifyContent="space-between">
            {!isNew && (
              <Button
                color="error"
                onClick={() => setShowDeleteDialog(true)}
                startIcon={<DeleteIcon />}
                size="large"
              >
                Delete
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              disabled={saving}
              size="large"
            >
              {saving ? "Saving…" : isNew ? "Save new recipe" : "Update recipe"}
            </Button>
          </Stack>
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
