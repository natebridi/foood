"use client";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { measures } from "@/lib/definitions";
import type { Ingredient } from "@/types/recipe";

interface Props {
  value: Ingredient[];
  onChange: (v: Ingredient[]) => void;
}

export default function IngredientEditor({ value, onChange }: Props) {
  function updateField(index: number, field: keyof Ingredient, val: string) {
    onChange(value.map((item, i) => (i === index ? { ...item, [field]: val } : item)));
  }

  function removeItem(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function addItem() {
    onChange([...value, { quantity: "", measure: -1, name: "", preparation: "" }]);
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {value.map((ingredient, index) => (
        <Box key={index} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <TextField
            value={ingredient.quantity ?? ""}
            onChange={(e) => updateField(index, "quantity", e.target.value)}
            placeholder="Qty"
            size="small"
            sx={{ width: 70 }}
          />
          <Select
            value={String(ingredient.measure ?? -1)}
            onChange={(e) => updateField(index, "measure", e.target.value)}
            size="small"
            displayEmpty
            sx={{ minWidth: 130 }}
          >
            <MenuItem value="-1"><em>—</em></MenuItem>
            {measures.map((m, i) => (
              <MenuItem key={i} value={String(i)}>{m.full}</MenuItem>
            ))}
          </Select>
          <TextField
            value={ingredient.name ?? ""}
            onChange={(e) => updateField(index, "name", e.target.value)}
            placeholder="Name"
            size="small"
            sx={{ flex: 2 }}
          />
          <TextField
            value={ingredient.preparation ?? ""}
            onChange={(e) => updateField(index, "preparation", e.target.value)}
            placeholder="Preparation"
            size="small"
            sx={{ flex: 1 }}
          />
          <IconButton onClick={() => removeItem(index)} size="small" color="default">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
      <Button
        onClick={addItem}
        startIcon={<AddIcon />}
        variant="outlined"
        size="small"
        sx={{ alignSelf: "flex-start" }}
      >
        Add ingredient
      </Button>
    </Box>
  );
}
