"use client";

import type { Ingredient as IngredientType } from "@/types/recipe";
import { measures } from "@/lib/definitions";
import { replaceFractions } from "@/lib/utils";

interface Props {
  ingredient: IngredientType;
}

export default function Ingredient({ ingredient }: Props) {
  let measureEl: React.ReactNode = null;

  if (ingredient.measure !== undefined && ingredient.measure !== null && ingredient.measure >= 0) {
    const m = measures[ingredient.measure];
    if (m) {
      measureEl = (
        <span className="measure">
          {Number(ingredient.quantity) > 1 ? m.plural : m.full}
        </span>
      );
    }
  }

  return (
    <li className="ingredient">
      <span className="ingredient-quantity">{replaceFractions(ingredient.quantity)}</span>
      <span className="ingredient-name">{measureEl} {ingredient.name}</span>
      <span className="ingredient-preparation">{ingredient.preparation}</span>
    </li>
  );
}
