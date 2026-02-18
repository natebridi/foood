"use client";

import type { Recipe } from "@/types/recipe";
import Ingredient from "./Ingredient";

interface Props {
  recipe: Recipe;
  onClose: () => void;
}

export default function IndexCard({ recipe, onClose }: Props) {
  const ingredients = recipe.ingredients?.map((ingredient, i) => (
    <Ingredient ingredient={ingredient} key={i} />
  ));

  const steps = recipe.steps?.map((step, i) => (
    <li key={i} dangerouslySetInnerHTML={{ __html: step }} />
  ));

  let timeTotal: React.ReactNode = null;
  if (recipe.time?.total) {
    timeTotal = <div><em>Time</em> {recipe.time.total}</div>;
  }

  let timeActive: React.ReactNode = null;
  if (recipe.time?.active) {
    timeActive = <div><em>Active</em> {recipe.time.active}</div>;
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
      <div className="notes">
        <h4>Notes</h4>
        <p dangerouslySetInnerHTML={{ __html: recipe.notes }} />
      </div>
    );
  }

  return (
    <div className="card-inner">
      <div className="title">
        <div className="close" onClick={onClose} />
        <h1 dangerouslySetInnerHTML={{ __html: recipe.title }} />
      </div>
      <div className="card-content">
        <ul className="stats">
          <li className="servings"><em>Servings</em> {recipe.servings}</li>
          <li><div className="time">{timeTotal}{timeActive}</div></li>
          <li className="source"><em>Source</em> {source}</li>
        </ul>
        <div className="card-body">
          <div className="card-left">
            <ul className="ingredients">{ingredients}</ul>
          </div>
          <div className="card-right">
            <ol className="steps">{steps}</ol>
            {notes}
          </div>
        </div>
      </div>
    </div>
  );
}
