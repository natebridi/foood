import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Ingredient from "./Ingredient";
import type { Ingredient as IngredientType } from "@/types/recipe";

function makeIngredient(overrides: Partial<IngredientType> = {}): IngredientType {
  return {
    quantity: "1",
    measure: 0, // cup
    name: "flour",
    preparation: "",
    ...overrides,
  };
}

describe("Ingredient", () => {
  it("renders the ingredient name", () => {
    render(<Ingredient ingredient={makeIngredient({ name: "butter" })} />);
    expect(screen.getByText("butter")).toBeInTheDocument();
  });

  it("renders the singular measure unit for quantity 1", () => {
    render(<Ingredient ingredient={makeIngredient({ quantity: "1", measure: 0 })} />);
    expect(screen.getByText("cup")).toBeInTheDocument();
  });

  it("renders the plural measure unit for quantity > 1", () => {
    render(<Ingredient ingredient={makeIngredient({ quantity: "2", measure: 0 })} />);
    expect(screen.getByText("cups")).toBeInTheDocument();
  });

  it("hides the measure when measure index is -1", () => {
    render(<Ingredient ingredient={makeIngredient({ measure: -1 })} />);
    expect(screen.queryByText("cup")).not.toBeInTheDocument();
    expect(screen.queryByText("cups")).not.toBeInTheDocument();
  });

  it("renders a preparation note when provided", () => {
    render(<Ingredient ingredient={makeIngredient({ preparation: "finely chopped" })} />);
    expect(screen.getByText("finely chopped")).toBeInTheDocument();
  });

  it("renders the ½ character for 0.5 quantity (HTML entity decoded by browser)", () => {
    const { container } = render(<Ingredient ingredient={makeIngredient({ quantity: "0.5" })} />);
    const quantityEl = container.querySelector(".quantity");
    // dangerouslySetInnerHTML decodes HTML entities, so we check the rendered character
    expect(quantityEl?.textContent).toContain("½");
  });

  it("renders wrapped in a list item", () => {
    const { container } = render(<Ingredient ingredient={makeIngredient()} />);
    expect(container.querySelector("li")).toBeInTheDocument();
  });
});
