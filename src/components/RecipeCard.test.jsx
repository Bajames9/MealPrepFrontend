// RecipeCard.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import RecipeCard from "./RecipeCard";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

// ---- Mock react-router-dom ----
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// ---- Mock FavoritesContext ----
const mockIsFavorited = vi.fn();
const mockToggleFavorite = vi.fn();

vi.mock("../contexts/FavoritesContext.jsx", () => ({
  useFavorites: () => ({
    isFavorited: mockIsFavorited,
    toggleFavorite: mockToggleFavorite,
  }),
}));

describe("RecipeCard Component", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders title and image", () => {
    render(
      <MemoryRouter>
        <RecipeCard id={1} title="Test Recipe" src="image.jpg" />
      </MemoryRouter>
    );

    expect(screen.getByText("Test Recipe")).toBeInTheDocument();
    expect(screen.getByAltText("Test Recipe")).toHaveAttribute("src", "image.jpg");
  });

  test("clicking the image navigates to recipe page", () => {
    render(
      <MemoryRouter>
        <RecipeCard id={5} title="Navigate Test" src="pic.jpg" />
      </MemoryRouter>
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/recipe/5");
  });

  test("heart button becomes visible on hover", () => {
    render(
      <MemoryRouter>
        <RecipeCard id={2} title="Hover Test" src="hover.jpg" />
      </MemoryRouter>
    );

    const card = screen.getByAltText("Hover Test").closest("div");

    // Heart button
    const heartButton = card.querySelector("button");

    // Initially invisible (opacity-0)
    expect(heartButton.className).toMatch("opacity-0");

    // Hover
    fireEvent.mouseEnter(card);

    expect(heartButton.className).toMatch("opacity-100");
  });

  test("clicking heart button triggers toggleFavorite", async () => {
    mockIsFavorited.mockReturnValue(false);

    render(
      <MemoryRouter>
        <RecipeCard id={7} title="Favorite Test" src="fav.jpg" />
      </MemoryRouter>
    );

    const card = screen.getByAltText("Favorite Test").closest("div");
    const heartButton = card.querySelector("button");

    fireEvent.mouseEnter(card); // make button visible
    fireEvent.click(heartButton);

    expect(mockToggleFavorite).toHaveBeenCalledWith(7);
  });

  test("shows filled heart when recipe is already favorited", () => {
    mockIsFavorited.mockReturnValue(true);

    render(
      <MemoryRouter>
        <RecipeCard id={3} title="Fav" src="img.jpg" />
      </MemoryRouter>
    );

    const solidHeart = document.querySelector("svg.text-red-500");

    expect(solidHeart).toBeInTheDocument();
  });

  test("shows outline heart when recipe is not favorited", () => {
    mockIsFavorited.mockReturnValue(false);

    render(
      <MemoryRouter>
        <RecipeCard id={3} title="Not Fav" src="img.jpg" />
      </MemoryRouter>
    );

    const outlineHeart = document.querySelector("svg.text-white");

    expect(outlineHeart).toBeInTheDocument();
  });

});
