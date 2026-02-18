"use client";

import { useState, useEffect } from "react";
import type { Recipe, RecipeListItem } from "@/types/recipe";
import IndexCard from "./IndexCard";

export default function Cookbook() {
  const [recipes, setRecipes] = useState<RecipeListItem[]>([]);
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [recipeOpen, setRecipeOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/recipes")
      .then((r) => r.json())
      .then((data: { id: number; title: string }[]) => {
        const withStyles = data.map((recipe, index) => ({
          ...recipe,
          colorStyle: `style-${(index % 7) + 1}`,
        }));
        setRecipes(withStyles);
      });
  }, []);

  function pullCardOut(id: number) {
    fetch(`/api/recipes/${id}`)
      .then((r) => r.json())
      .then((recipe: Recipe) => {
        setCurrentRecipe(recipe);
        setRecipeOpen(true);
      });
  }

  function putCardAway() {
    setRecipeOpen(false);
  }

  const filteredRecipes = query
    ? recipes.filter((r) => r.title.toLowerCase().includes(query.toLowerCase()))
    : recipes;

  return (
    <div className={recipeOpen ? "content-wrap open" : "content-wrap"}>
      <div className="content-inner">
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
              <li
                key={i}
                onClick={() => pullCardOut(recipe.id)}
                className={recipe.colorStyle}
              >
                <span dangerouslySetInnerHTML={{ __html: recipe.title }} />
              </li>
            ))}
          </ul>
        </div>
        <div className="card-wrap">
          {currentRecipe && (
            <IndexCard recipe={currentRecipe} onClose={putCardAway} />
          )}
        </div>
      </div>
    </div>
  );
}
