import { useParams } from "react-router-dom";
import SideBar from "../components/SideBar.jsx";
import { useCallback } from "react";
import SearchBar from "../components/SearchBar.jsx";

import { useRecipeSearch } from "../hooks/useRecipeSearch.jsx";
import { useState } from "react";


function SearchPage() {
    // Get the initial search term from the URL
    const { term: urlTerm } = useParams();

    // Hook used to get Search Results
    const {
        search,
        setSearch,
        SearchByIngredients,
        setSearchByIngredients,
        SearchByRecipeName,
        setSearchByRecipeName,
        SearchResults,
        loading,
        hasMore,
        recipesList,
        loadNextPage,
    } = useRecipeSearch(urlTerm, true);


    //handles Scrolling login loads more search results when user hits bottom of list
    const handleScroll = useCallback((e) => {
        const target = e.target;

        if (loading || !hasMore || !loadNextPage) return;

        // Check if the user has scrolled near the bottom
        if (target.scrollHeight - target.scrollTop <= target.clientHeight + 1) {
            console.log("Reached the bottom of the scrollable area! Loading next page.");
            loadNextPage();
        }
    }, [loading, hasMore, loadNextPage]);

    // Determine search mode text for badge
    const getSearchModeText = () => {
        if (SearchByIngredients) {
            return '🔍 Searching: Ingredients Only';
        } else if (SearchByRecipeName) {
            return '🔍 Searching: Recipe Name Only';
        } else {
            return '🔍 Searching: All Fields (Name, Description, Ingredients)';
        }
    };

    // Determine badge color based on mode
    const getBadgeColor = () => {
        if (SearchByIngredients) {
            return 'bg-darkBluePC text-white';
        } else if (SearchByRecipeName) {
            return 'bg-lightGreenPC text-darkBluePC';
        } else {
            return 'bg-overlayPC text-white';
        }
    };


    //React Code
    return (
        <div className="bg-lightBluePC w-full h-screen">
            <div className="w-full h-full flex flex-col">
                <SideBar
                    className="font-black bg-darkBluePC/65 absolute z-10"
                />

                {/*Search bar*/}
                <div className="flex flex-col gap-4 justify-center items-center w-full mt-10">
                    <SearchBar
                        search={search}
                        setSearch={setSearch}
                        onToggleIngredients={setSearchByIngredients}
                        isIngredientsSelected={SearchByIngredients}
                        onToggleRecipeName={setSearchByRecipeName}
                        isRecipeNameSelected={SearchByRecipeName}
                        onToggleLists={() => { }}
                        isListsSelected={false}
                    />

                    {/* Search Mode Indicator Badge */}
                    {search && search.trim() !== '' && (
                        <div className={`px-6 py-3 rounded-full text-xl font-bold shadow-lg ${getBadgeColor()}`}>
                            {getSearchModeText()}
                        </div>
                    )}
                </div>

                {/*Contains Search results*/}
                <div
                    className="flex flex-row flex-wrap gap-4 p-4 justify-center items-start w-full overflow-y-auto"
                    onScroll={handleScroll}
                >
                    {SearchResults}

                    {/* Display loading message/spinner at the bottom */}
                    {loading &&
                        <div className="w-full text-center p-4 text-white text-2xl">
                            Loading more recipes...
                        </div>
                    }

                    {/* Display end message if no more results */}
                    {!hasMore && recipesList.length > 0 &&
                        <div className="w-full text-center p-4 text-gray-400">
                            You've reached the end of the results.
                        </div>
                    }
                </div>

            </div>
        </div>
    );
}
export default SearchPage