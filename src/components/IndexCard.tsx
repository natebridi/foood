"use client";

import { useRouter } from "next/navigation";
import type { Recipe } from "@/types/recipe";
import Ingredient from "./Ingredient";
import styles from "@/app/styles/recipe.module.css";

interface Props {
  recipe: Recipe;
  onClose?: () => void;
}

export default function IndexCard({ recipe, onClose }: Props) {
  const router = useRouter();
  const handleClose =
    onClose ??
    (() => {
      document.documentElement.dataset.navDirection = "backward";
      if ("startViewTransition" in document) {
        (
          document as Document & { startViewTransition: (fn: () => void) => void }
        ).startViewTransition(() => router.push("/"));
      } else {
        router.push("/");
      }
    });
  const ingredients = recipe.ingredients?.map((ingredient, i) => (
    <Ingredient ingredient={ingredient} key={i} />
  ));

  const steps = recipe.steps?.map((step, i) => (
    <li className={styles.step} key={i} dangerouslySetInnerHTML={{ __html: step }} />
  ));

  let timeTotal: React.ReactNode = null;
  if (recipe.time?.total) {
    timeTotal = (
      <div>
        <span className={styles.statLabel}>Time</span>
        <span className={styles.statValue}>{recipe.time.total}</span>
      </div>
    );
  }

  let timeActive: React.ReactNode = null;
  if (recipe.time?.active) {
    timeActive = (
      <div className={styles.addLeftMargin}>
        <span className={styles.statLabel}>Active</span>
        <span className={styles.statValue}>{recipe.time.active}</span>
      </div>
    );
  }

  let source: React.ReactNode = null;
  if (recipe.source?.url) {
    source = <a href={recipe.source.url}>{recipe.source.name}</a>;
  } else if (recipe.source?.name) {
    source = recipe.source.name;
  }

  let notes: React.ReactNode = null;
  if (recipe.notes) {
    notes = (
      <div className={styles.notes}>
        <h3 className={styles.notesTitle}>Notes</h3>
        <p className={styles.notesContent} dangerouslySetInnerHTML={{ __html: recipe.notes }} />
      </div>
    );
  }

  return (
    <div className={styles.recipeWrap}>
      <div className={styles.titleBar}>
        <h1 className={styles.title}>{recipe.title}</h1>
        <button className={styles.close} onClick={handleClose} aria-label="See all recipes" />
      </div>
      <div className={styles.recipeContent}>
        <ul className={styles.stats}>
          <li className={styles.stat}>
            <span className={styles.statLabel}>Servings</span>
            <span className={styles.statValue}>{recipe.servings}</span>
          </li>
          <li className={styles.stat}>
            {timeTotal}
            {timeActive}
          </li>
          <li className={styles.stat}>
            <span className={styles.statLabel}>Source</span>
            <span className={styles.statValue}>{source}</span>
          </li>
        </ul>
        <div className={styles.recipeMain}>
          <ul className={styles.recipeIngredients}>{ingredients}</ul>
          <div className={styles.recipeBody}>
            <ol className={styles.steps}>{steps}</ol>
            {notes}
          </div>
        </div>
      </div>
    </div>
  );
}
