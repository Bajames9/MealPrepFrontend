import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "./SearchBar";


describe("SearchBar Component", () => {
    const mockSetSearch = vi.fn();
    const mockOnSearchSubmit = vi.fn();
    const mockIngredientsToggle = vi.fn();
    const mockRecipeNameToggle = vi.fn();
    const mockListsToggle = vi.fn();

    const renderSearchBar = (searchValue = "") =>
        render(
            <SearchBar
                search={searchValue}
                setSearch={mockSetSearch}
                onSearchSubmit={mockOnSearchSubmit}
                onToggleIngredients={mockIngredientsToggle}
                isIngredientsSelected={false}
                onToggleRecipeName={mockRecipeNameToggle}
                isRecipeNameSelected={false}
                onToggleLists={mockListsToggle}
                isListsSelected={false}
            />
        );

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders the search input", () => {
        renderSearchBar();
        expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("updates input value when typing", () => {
        renderSearchBar();

        const input = screen.getByRole("textbox");

        fireEvent.change(input, { target: { value: "chicken" } });

        expect(mockSetSearch).toHaveBeenCalledWith("chicken");
    });

    it("calls onSearchSubmit when pressing Enter with non-empty input", () => {
        renderSearchBar("pasta");

        const input = screen.getByRole("textbox");

        fireEvent.keyDown(input, { key: "Enter" });

        expect(mockOnSearchSubmit).toHaveBeenCalledWith("pasta");
    });

    it("does NOT call onSearchSubmit when pressing Enter with an empty input", () => {
        renderSearchBar("");

        const input = screen.getByRole("textbox");

        fireEvent.keyDown(input, { key: "Enter" });

        expect(mockOnSearchSubmit).not.toHaveBeenCalled();
    });

    it("renders the FilterButton", () => {
        renderSearchBar();

        // FilterButton has buttons inside it, so we check for them:
        const buttons = screen.getAllByRole("button");
        expect(buttons.length).toBeGreaterThan(0);
    });
});
