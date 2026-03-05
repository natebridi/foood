"use client";

import { useState, useEffect, useRef } from "react";
import type { RecipeListItem } from "@/types/recipe";
import TransitionLink from "./TransitionLink";
import styles from "@/app/styles/cookbook.module.css";
import { SearchIcon, FooodLogo, CloseIcon } from "@/components/Images";

export default function Cookbook() {
  const [recipes, setRecipes] = useState<RecipeListItem[]>([]);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

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
      <div className={`${styles.titleBar} ${query !== "" ? styles.active : ""}`}>
        <div className={styles.searchContain}>
          <h1 className={styles.logoWrap}>
            <FooodLogo className={styles.logo} />
          </h1>

          <div className={styles.searchWrap}>
            <button
              className={styles.searchIconBtn}
              onMouseDown={(e) => {
                e.preventDefault();
                inputRef.current?.focus();
              }}
              onClick={() => inputRef.current?.focus()}
              aria-label="Search"
              tabIndex={1}
              type="button"
            >
              <SearchIcon className={styles.searchIcon} />
            </button>
            <input
              ref={inputRef}
              className={styles.searchInput}
              type="text"
              role="searchbox"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              className={styles.closeIconBtn}
              onMouseDown={(e) => {
                e.preventDefault();
                setQuery("");
                inputRef.current?.blur();
              }}
              onClick={() => {
                setQuery("");
                inputRef.current?.blur();
              }}
              type="button"
              aria-label="Clear search"
            >
              <CloseIcon className={styles.closeIcon} />
            </button>
          </div>
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
