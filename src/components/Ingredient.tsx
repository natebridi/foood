"use client";

import type { Ingredient as IngredientType } from "@/types/recipe";
import { measures } from "@/lib/definitions";
import { replaceFractions } from "@/lib/utils";
import styles from "@/app/styles/ingredient.module.css";

interface Props {
  ingredient: IngredientType;
}

export default function Ingredient({ ingredient }: Props) {
  let measureEl: React.ReactNode = null;

  if (ingredient.measure !== undefined && ingredient.measure !== null && ingredient.measure >= 0) {
    const m = measures[ingredient.measure];
    if (m) {
      measureEl = Number(ingredient.quantity) > 1 ? m.plural : m.full;
    }
  }

  return (
    <li className={styles.ingredient}>
      <span className={styles.ingredientQuantity}>{replaceFractions(ingredient.quantity)}</span>
      <span className={styles.ingredientName}>
        {measureEl} {ingredient.name}
      </span>
      <span className={styles.ingredientPreparation}>{ingredient.preparation}</span>
    </li>
  );
}
