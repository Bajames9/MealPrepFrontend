import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import FilterButton from "./FilterButton.jsx";
import React from "react";


/**
 * Component used to generate Search bar
 * Now supports Ingredients, Recipe Name, and Lists filters
 */
function SearchBar({
    search,
    setSearch,
    onSearchSubmit,
    onToggleIngredients,
    isIngredientsSelected,
    onToggleRecipeName,
    isRecipeNameSelected,
    onToggleLists,
    isListsSelected
}) {
    return (
        <div className="w-full h-full">
            <div className="flex flex-row gap-10 justify-center items-center w-full h-1/8 m-10">
                <div className="relative w-3/4">
                    <MagnifyingGlassIcon
                        className="absolute left-0 top-0 ml-5 size-8 text-darkBluePC h-full flex items-center"
                    />

                    <input
                        className="w-full h-15 shadow-xl text-2xl font-bold rounded-2xl text-darkBluePC p-5 pl-16 bg-lightGreenPC"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && search !== "") {
                                e.preventDefault();
                                onSearchSubmit(search);
                            }
                        }}
                    />
                </div>

                <FilterButton
                    onToggleIngredients={onToggleIngredients}
                    isIngredientsSelected={isIngredientsSelected}
                    onToggleRecipeName={onToggleRecipeName}
                    isRecipeNameSelected={isRecipeNameSelected}
                    onToggleLists={onToggleLists}
                    isListsSelected={isListsSelected}
                />
            </div>
        </div>
    );
}

export default SearchBar;