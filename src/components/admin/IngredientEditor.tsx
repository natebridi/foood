"use client";

import { measures } from "@/lib/definitions";
import type { Ingredient } from "@/types/recipe";

interface Props {
  value: Ingredient[];
  onChange: (v: Ingredient[]) => void;
}

export default function IngredientEditor({ value, onChange }: Props) {
  function updateField(index: number, field: keyof Ingredient, val: string) {
    const updated = value.map((item, i) =>
      i === index ? { ...item, [field]: val } : item
    );
    onChange(updated);
  }

  function removeItem(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function addItem() {
    onChange([...value, { quantity: "", measure: -1, name: "", preparation: "" }]);
  }

  return (
    <div>
      {value.map((ingredient, index) => (
        <div className="ingredient" key={index}>
          <input
            type="text"
            value={ingredient.quantity ?? ""}
            onChange={(e) => updateField(index, "quantity", e.target.value)}
            placeholder="Quantity"
          />
          <div className="select-wrap">
            <select
              value={ingredient.measure ?? -1}
              onChange={(e) => updateField(index, "measure", e.target.value)}
            >
              <option value="-1"></option>
              {measures.map((measure, i) => (
                <option value={i} key={i}>{measure.full}</option>
              ))}
            </select>
          </div>
          <input
            type="text"
            value={ingredient.name ?? ""}
            onChange={(e) => updateField(index, "name", e.target.value)}
            placeholder="Name"
          />
          <input
            type="text"
            value={ingredient.preparation ?? ""}
            onChange={(e) => updateField(index, "preparation", e.target.value)}
            placeholder="Preparation"
          />
          <div className="delete" onClick={() => removeItem(index)}>&times;</div>
        </div>
      ))}
      <div className="add-ingredient" onClick={addItem}>Add</div>
    </div>
  );
}
