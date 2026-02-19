export interface Measure {
  full: string;
  plural: string;
  short: string;
}

export interface Ingredient {
  quantity: string;
  measure: number;
  name: string;
  preparation: string;
}

export interface RecipeListItem {
  id: number;
  title: string;
  slug: string;
  colorStyle: string;
}

export interface Recipe {
  id: number;
  title: string;
  slug: string;
  servings: string;
  time: { total: string; active: string };
  source: { name: string; url: string };
  notes: string;
  ingredients: Ingredient[];
  steps: string[];
  tags: string[];
}

export interface RecipeRow {
  id: number;
  title: string;
  slug: string;
  servings: string;
  timetotal: string;
  timeactive: string;
  sourcename: string;
  sourceurl: string;
  notes: string;
  ingredients: string;
  steps: string;
  tags: string;
}
