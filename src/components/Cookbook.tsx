"use client";

import { useState, useEffect } from "react";
import type { RecipeListItem } from "@/types/recipe";
import TransitionLink from "./TransitionLink";

export default function Cookbook() {
  const [recipes, setRecipes] = useState<RecipeListItem[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/recipes")
      .then((r) => r.json())
      .then((data: { id: number; title: string; slug: string }[]) => {
        const withStyles = data.map((recipe, index) => ({
          ...recipe,
          colorStyle: `style-${(index % 7) + 1}`,
        }));
        setRecipes(withStyles);
      });
  }, []);

  const filteredRecipes = query
    ? recipes.filter((r) => r.title.toLowerCase().includes(query.toLowerCase()))
    : recipes;

  return (
    <div className="menu-wrap">
      <ul className="controls">
        <li>
          <i>F</i><i>o</i><i>o</i><i>o</i><i>d</i>
        </li>
        <li className={query !== "" ? "active" : ""}>
          <input
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <div className="clear" onClick={() => setQuery("")} />
          )}
        </li>
      </ul>
      <ul className="menu">
        {filteredRecipes.map((recipe, i) => (
          <li key={i} className={recipe.colorStyle}>
            <TransitionLink href={`/${recipe.slug}`}>
              <span dangerouslySetInnerHTML={{ __html: recipe.title }} />
            </TransitionLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
