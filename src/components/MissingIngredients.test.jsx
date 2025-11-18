// MissingIngredients.test.jsx
import { render, screen, waitFor } from "@testing-library/react";
import MissingIngredients from "./MissingIngredients";
import { vi } from "vitest";

// --- Mock the API ---
vi.mock("../services/api.js", () => ({
  getMissingIngredients: vi.fn(),
}));

import { getMissingIngredients } from "../services/api.js";

// Silence console.error for cleaner test output
vi.spyOn(console, "error").mockImplementation(() => {});

describe("MissingIngredients Component", () => {

  test("shows loading skeleton initially", () => {
    getMissingIngredients.mockResolvedValueOnce({
      success: true,
      missing_ingredients: [],
      pantry_items: [],
    });

    const { container } = render(<MissingIngredients recipeId={123} />);

    // The skeleton uses "animate-pulse" class
    const skeleton = container.querySelector(".animate-pulse");
    expect(skeleton).toBeInTheDocument();

    // There should be multiple skeleton blocks
    const blocks = container.querySelectorAll(".bg-gray-600\\/30");
    expect(blocks.length).toBeGreaterThan(0);
  });

  test("shows error message when API fails", async () => {
    getMissingIngredients.mockRejectedValueOnce(new Error("API error"));

    render(<MissingIngredients recipeId={5} />);

    await waitFor(() =>
      expect(
        screen.getByText(/failed to load ingredient information/i)
      ).toBeInTheDocument()
    );
  });

  test("returns null when no missing or pantry items", async () => {
    getMissingIngredients.mockResolvedValueOnce({
      success: true,
      missing_ingredients: [],
      pantry_items: [],
    });

    const { container } = render(<MissingIngredients recipeId={1} />);

    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });

  test("renders missing ingredients section", async () => {
    getMissingIngredients.mockResolvedValueOnce({
      success: true,
      missing_ingredients: ["Eggs", "Milk"],
      pantry_items: [],
    });

    render(<MissingIngredients recipeId={10} />);

    await waitFor(() => {
      expect(
        screen.getByText(/Missing from Pantry \(2\)/i)
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Eggs")).toBeInTheDocument();
    expect(screen.getByText("Milk")).toBeInTheDocument();
  });

  test("renders pantry items section", async () => {
    getMissingIngredients.mockResolvedValueOnce({
      success: true,
      missing_ingredients: [],
      pantry_items: ["Salt", "Pepper"],
    });

    render(<MissingIngredients recipeId={10} />);

    await waitFor(() => {
      expect(screen.getByText(/You Have \(2\)/i)).toBeInTheDocument();
    });

    expect(screen.getByText("Salt")).toBeInTheDocument();
    expect(screen.getByText("Pepper")).toBeInTheDocument();
  });

});
