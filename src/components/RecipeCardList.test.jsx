// RecipeCardList.test.jsx
import { render, screen } from "@testing-library/react";
import RecipeCardList from "./RecipeCardList";
import { vi } from "vitest";

// ---- Mock RecipeCard so we don't render its internals ----
vi.mock("./RecipeCard.jsx", () => ({
  default: ({ title }) => <div data-testid="recipe-card">{title}</div>,
}));

describe("RecipeCardList Component", () => {

  test("shows loading message when no recipes provided", () => {
    render(<RecipeCardList recipes={null} />);

    expect(screen.getByText(/loading recipes/i)).toBeInTheDocument();
  });

  test("renders the correct number of RecipeCard components", () => {
    const mockData = {
      recipes: [
        { id: 1, name: "Pizza", image: "pizza.jpg" },
        { id: 2, name: "Salad", image: "salad.jpg" },
        { id: 3, name: "Soup", image: "soup.jpg" },
      ],
    };

    render(<RecipeCardList recipes={mockData} />);

    const cards = screen.getAllByTestId("recipe-card");
    expect(cards.length).toBe(3);
  });

  test("renders recipe titles inside mocked RecipeCard", () => {
    const mockData = {
      recipes: [
        { id: 5, name: "Tacos", image: "tacos.jpg" },
      ],
    };

    render(<RecipeCardList recipes={mockData} />);

    expect(screen.getByText("Tacos")).toBeInTheDocument();
  });

});
