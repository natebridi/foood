"use client";

import { useState, useEffect } from "react";
import type { RecipeListItem } from "@/types/recipe";
import TransitionLink from "./TransitionLink";
import styles from "@/app/styles/cookbook.module.css";

export default function Cookbook() {
  const [recipes, setRecipes] = useState<RecipeListItem[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/recipes")
      .then((r) => r.json())
      .then((data: { id: number; title: string; slug: string }[]) => {
        const withStyles = data.map((recipe, index) => ({
          ...recipe,
          colorStyle: `${styles.recipe} ${styles[`style-${(index % 7) + 1}`]}`,
        }));
        setRecipes(withStyles);
      });
  }, []);

  const filteredRecipes = query
    ? recipes.filter((r) => r.title.toLowerCase().includes(query.toLowerCase()))
    : recipes;

  return (
    <div className="menu-wrap">
      <div className={styles.titleBar}>
        <h1 className={styles.title}>
          <i>F</i>
          <i>o</i>
          <i>o</i>
          <i>o</i>
          <i>d</i>
        </h1>
        <div className={`${styles.searchWrap} ${query !== "" ? "active" : ""}`}>
          <input
            type="text"
            className={styles.search}
            role="searchbox"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button className="clear" onClick={() => setQuery("")} aria-label="Clear search" />
          )}
        </div>
      </div>
      <ul className={styles.recipes}>
        {filteredRecipes.map((recipe, i) => (
          <li key={i} className={recipe.colorStyle} data-testid="recipe-tile">
            <TransitionLink href={`/${recipe.slug}`}>
              <span dangerouslySetInnerHTML={{ __html: recipe.title }} />
            </TransitionLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
