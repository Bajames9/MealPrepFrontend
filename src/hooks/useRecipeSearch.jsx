// hooks/useSharedSearch.js

import { useState, useEffect, useCallback } from "react";
import { searchRecipe, searchRecipeByIngredients, searchRecipeByName } from "../services/api.js";
import { mapRecipeList } from "../services/utility.jsx";

const DEFAULT_ITEMS_PER_PAGE = 12; // Lower value for Home preview
const SEARCH_PAGE_ITEMS_PER_PAGE = 100; // High value for dedicated SearchPage

/**
 * Custom hook for shared recipe search logic.
 * Now supports 3 search modes: All Fields, Ingredients Only, Recipe Name Only
 *
 * @param {string} initialTerm - Initial search term (e.g., from URL params).
 * @param {boolean} isDedicatedPage - If true, enables infinite scrolling logic (larger page size, appending results).
 * @returns {object} Search state and functions.
 */
export const useRecipeSearch = (initialTerm = '', isDedicatedPage = false) => {
    // Search State
    const [search, setSearch] = useState(initialTerm);
    const [SearchByIngredients, setSearchByIngredients] = useState(false);
    const [SearchByRecipeName, setSearchByRecipeName] = useState(false);

    // Pagination/Results State
    const itemsPerPage = isDedicatedPage ? SEARCH_PAGE_ITEMS_PER_PAGE : DEFAULT_ITEMS_PER_PAGE;
    const [currentPage, setCurrentPage] = useState(1);
    const [SearchResults, setSearchResults] = useState(null); // Mapped cards
    const [hasMore, setHasMore] = useState(true); // If more pages exist
    const [loading, setLoading] = useState(false);
    const [recipesList, setRecipesList] = useState([]); // Raw recipe objects (needed for appending on SearchPage)


    // Reset logic when the primary search term or toggle changes
    useEffect(() => {
        // Only reset if the term or filter toggle actually changes
        // This prevents resetting when only the page number changes.
        if (search.trim() === initialTerm.trim() && currentPage === 1) return;

        setRecipesList([]);
        setSearchResults(null);
        setCurrentPage(1);
        setHasMore(true);
    }, [search, SearchByIngredients, SearchByRecipeName, initialTerm]);


    // Core Fetch Logic (runs on search, currentPage, or filter toggle change)
    useEffect(() => {
        const searchTerm = search.trim();
        if (searchTerm === "" || !hasMore) {
            if (searchTerm === "") setSearchResults(null);
            return;
        }

        const controller = new AbortController();

        const fetchSearch = async () => {
            setLoading(true);

            try {
                let results = "";

                // Note: The API call should ideally use (page, itemsPerPage) as you had it,
                // not offset, but I'll stick to (page, ITEMS_PER_PAGE) since that's what your API suggests.

                // Determine which search endpoint to use based on filters
                if (SearchByIngredients) {
                    // Ingredients Only mode
                    results = await searchRecipeByIngredients(searchTerm, currentPage, itemsPerPage, controller.signal);
                } else if (SearchByRecipeName) {
                    // Recipe Name Only mode
                    results = await searchRecipeByName(searchTerm, currentPage, itemsPerPage, controller.signal);
                } else {
                    // All Fields mode (default)
                    results = await searchRecipe(searchTerm, currentPage, itemsPerPage, controller.signal);
                }

                const newRecipes = Array.isArray(results.recipes) ? results.recipes : [];

                // Determine if more results exist
                setHasMore(newRecipes.length === itemsPerPage);

                // Update the raw list
                setRecipesList(prevList => {
                    // Always replace for the first page of a new search
                    if (currentPage === 1) return newRecipes;
                    // Append for subsequent pages
                    return [...prevList, ...newRecipes];
                });

            } catch (err) {
                if (err.name !== "AbortError") console.error("Search fetch failed:", err);
            } finally {
                setLoading(false);
            }
        };

        const debounceTime = currentPage === 1 ? 300 : 0; // Debounce only for the first page search (user typing)
        const debounceTimer = setTimeout(fetchSearch, debounceTime);

        return () => {
            controller.abort();
            clearTimeout(debounceTimer);
        };
    }, [search, SearchByIngredients, SearchByRecipeName, currentPage, itemsPerPage, hasMore]);


    // Mapping Logic (runs whenever raw list changes)
    useEffect(() => {
        if (recipesList.length > 0) {
            const cards = mapRecipeList({ recipes: recipesList }, "bg-darkBluePC");
            setSearchResults(cards);
        } else if (currentPage === 1 && !loading && search.trim() !== '') {
            // No recipes found message for a fresh search attempt
            setSearchResults(<p className="text-white text-3xl">No recipes found for "{search}"</p>);
        } else if (search.trim() === '') {
            setSearchResults(null);
        }
    }, [recipesList, search, loading, currentPage]);


    // Functions to expose
    const loadNextPage = useCallback(() => {
        if (!loading && hasMore) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    }, [loading, hasMore]);

    const handleSearchChange = useCallback((newTerm) => {
        setSearch(newTerm);
        setCurrentPage(1); // Reset page on user typing
    }, []);

    const handleToggleIngredients = useCallback((isIngredients) => {
        setSearchByIngredients(isIngredients);
        setCurrentPage(1); // Reset page on toggle change
    }, []);

    const handleToggleRecipeName = useCallback((isRecipeName) => {
        setSearchByRecipeName(isRecipeName);
        setCurrentPage(1); // Reset page on toggle change
    }, []);


    return {
        search,
        setSearch: handleSearchChange,
        SearchByIngredients,
        setSearchByIngredients: handleToggleIngredients,
        SearchByRecipeName,
        setSearchByRecipeName: handleToggleRecipeName,
        SearchResults,
        loading,
        hasMore,
        recipesList, // Raw list for use in external components if needed
        loadNextPage: isDedicatedPage ? loadNextPage : null, // Only expose loadNextPage on the dedicated page
        currentPage,
    };
};