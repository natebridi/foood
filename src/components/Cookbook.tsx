"use client";

import { useState, useEffect, useRef } from "react";
import type { RecipeListItem } from "@/types/recipe";
import TransitionLink from "./TransitionLink";
import styles from "@/app/styles/cookbook.module.css";
import { SearchIcon, CloseIcon } from "@/components/Images";

type SortKey = "title-asc" | "title-desc" | "id-asc" | "id-desc";

export default function Cookbook() {
  const [recipes, setRecipes] = useState<RecipeListItem[]>([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("title-asc");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/recipes")
      .then((r) => r.json())
      .then((data: { id: number; title: string; slug: string; tags: string[] }[]) => {
        const withStyles = data.map((recipe) => ({
          ...recipe,
          colorStyle: `${styles.recipe} ${styles[`style-${(recipe.id % 7) + 1}`]}`,
        }));
        setRecipes(withStyles);
      });
  }, []);

  const allTags = [...new Set(recipes.flatMap((r) => r.tags ?? []))].sort();

  let displayed = query
    ? recipes.filter((r) => r.title.toLowerCase().includes(query.toLowerCase()))
    : recipes;

  if (activeTag) {
    displayed = displayed.filter((r) => r.tags?.includes(activeTag));
  }

  if (sort === "title-desc") {
    displayed = [...displayed].sort((a, b) => b.title.localeCompare(a.title));
  } else if (sort === "id-asc") {
    displayed = [...displayed].sort((a, b) => a.id - b.id);
  } else if (sort === "id-desc") {
    displayed = [...displayed].sort((a, b) => b.id - a.id);
  }

  return (
    <div className="menu-wrap">
      <div className={`${styles.titleBar} ${query !== "" ? styles.active : ""}`}>
        <div className={styles.searchContain}>
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

      {allTags.length > 0 && (
        <div className={styles.filterBar}>
          <div className={styles.tagList}>
            {allTags.map((tag) => (
              <button
                key={tag}
                className={`${styles.tagChip} ${activeTag === tag ? styles.tagChipActive : ""}`}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                type="button"
              >
                {tag}
              </button>
            ))}
          </div>
          <select
            className={styles.sortSelect}
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label="Sort recipes"
          >
            <option value="title-asc">A → Z</option>
            <option value="title-desc">Z → A</option>
            <option value="id-desc">Newest first</option>
            <option value="id-asc">Oldest first</option>
          </select>
        </div>
      )}

      <ul className={styles.recipes}>
        {displayed.map((recipe, i) => (
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
