// FilterButton.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import FilterButton from "./FilterButton";

describe("FilterButton Component", () => {
  test("renders the filter button container", () => {
    render(
      <FilterButton
        onToggleIngredients={() => {}}
        isIngredientsSelected={false}
        onToggleRecipeName={() => {}}
        isRecipeNameSelected={false}
        onToggleLists={() => {}}
        isListsSelected={false}
      />
    );

    // Outer container
    expect(screen.getByTestId("filter-button")).toBeInTheDocument();
  });

  test("expands when hovered", () => {
    render(
      <FilterButton
        onToggleIngredients={() => {}}
        isIngredientsSelected={false}
        onToggleRecipeName={() => {}}
        isRecipeNameSelected={false}
        onToggleLists={() => {}}
        isListsSelected={false}
      />
    );

    const button = screen.getByTestId("filter-button");

    fireEvent.mouseOver(button);

    // "Ingredients" should become visible when expanded
    expect(screen.getByText("Ingredients")).toBeVisible();
  });

  test("clicking Ingredients triggers onToggleIngredients", () => {
    const handleIngredients = vi.fn();

    render(
      <FilterButton
        onToggleIngredients={handleIngredients}
        isIngredientsSelected={false}
        onToggleRecipeName={() => {}}
        isRecipeNameSelected={false}
        onToggleLists={() => {}}
        isListsSelected={false}
      />
    );

    const button = screen.getByTestId("filter-button");

    fireEvent.mouseOver(button); // expand menu

    fireEvent.click(screen.getByLabelText("search by ingredients toggle"));

    // Should toggle to true
    expect(handleIngredients).toHaveBeenCalledWith(true);
  });

  test("selecting Recipe Name unselects Ingredients", () => {
    const handleIngredients = vi.fn();
    const handleRecipeName = vi.fn();

    render(
      <FilterButton
        onToggleIngredients={handleIngredients}
        isIngredientsSelected={true}
        onToggleRecipeName={handleRecipeName}
        isRecipeNameSelected={false}
        onToggleLists={() => {}}
        isListsSelected={false}
      />
    );

    const button = screen.getByTestId("filter-button");

    fireEvent.mouseOver(button); // open dropdown
    fireEvent.click(screen.getByLabelText("search by recipe name toggle"));

    // Recipe Name gets selected
    expect(handleRecipeName).toHaveBeenCalledWith(true);

    // Ingredients gets deselected
    expect(handleIngredients).toHaveBeenCalledWith(false);
  });
});
