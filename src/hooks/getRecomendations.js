import { useState, useEffect } from "react";
import { getRecipeCategory, getRecommendations } from "../services/api.js";
import { mapRecipeList } from "../services/utility.jsx";
import { recipeCategories } from "../assets/recipeCategories.js";
import { whoAmI } from "../services/api.js";

/**
 * Custom hook to fetch and process data for the Home component.
 * It fetches recommendations based on pantry, five random categories, and favorites (placeholder).
 * Caches recommendations in sessionStorage per user until pantry is updated.
 *
 * @returns {object} An object containing the mapped card lists, category names, and loading states.
 */
export const useHomeData = () => {
    // User State
    const [currentUser, setCurrentUser] = useState(null);

    // Recommendation State
    const [recommendationCards, setRecommendationCards] = useState(null);
    const [recommendationsLoading, setRecommendationsLoading] = useState(true);

    // Category States (now 5 instead of 3)
    const [category1, setCategory1] = useState(null);
    const [category1Cards, setCategory1Cards] = useState(null);

    const [category2, setCategory2] = useState(null);
    const [category2Cards, setCategory2Cards] = useState(null);

    const [category3, setCategory3] = useState(null);
    const [category3Cards, setCategory3Cards] = useState(null);

    const [category4, setCategory4] = useState(null);
    const [category4Cards, setCategory4Cards] = useState(null);

    const [category5, setCategory5] = useState(null);
    const [category5Cards, setCategory5Cards] = useState(null);

    // Favorites State
    const [favoriteCards, setFavoriteCards] = useState(null);

    // --- Utility function for getting unique categories ---
    const getRandomUniqueCategory = (() => {
        const categoryPool = [...recipeCategories]; // Create a mutable copy of the list

        return () => {
            if (categoryPool.length === 0) {
                console.warn("Category pool is empty. Cannot select more unique categories.");
                return null;
            }
            const randomIndex = Math.floor(Math.random() * categoryPool.length);
            const category = categoryPool[randomIndex];
            categoryPool.splice(randomIndex, 1);
            return category;
        };
    })(); // Immediately invoked function to create a closure for categoryPool

    // --- Helper function to get user-specific cache keys ---
    const getCacheKey = (baseKey) => {
        // Use 'guest' for non-logged-in users
        const userKey = currentUser || 'guest';
        return `${userKey}_${baseKey}`;
    };

    // --- Effect to get current user on mount ---
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await whoAmI();
                if (response.success && response.user) {
                    setCurrentUser(response.user);
                } else {
                    setCurrentUser('guest');
                }
            } catch (err) {
                console.error("Failed to get current user:", err);
                setCurrentUser('guest');
            }
        };

        fetchCurrentUser();
    }, []);

    // --- Effect for fetching Recommendations and Favorites when user is known ---
    useEffect(() => {
        // Don't fetch until we know who the user is
        if (currentUser === null) return;

        const fetchRecommendations = async () => {
            setRecommendationsLoading(true);

            try {
                // Use user-specific cache keys
                const cacheKey = getCacheKey('recommendations_cache');
                const cacheTimeKey = getCacheKey('recommendations_cache_time');
                const pantryTimeKey = getCacheKey('pantry_last_updated');

                // Check cache first
                const cachedRecommendations = sessionStorage.getItem(cacheKey);
                const cacheTimestamp = sessionStorage.getItem(cacheTimeKey);
                const pantryTimestamp = sessionStorage.getItem(pantryTimeKey);

                // Use cache if:
                // 1. Cache exists
                // 2. Cache was created after last pantry update (or no pantry update yet)
                if (cachedRecommendations && cacheTimestamp) {
                    const shouldUseCache = !pantryTimestamp ||
                        parseInt(cacheTimestamp) > parseInt(pantryTimestamp);

                    if (shouldUseCache) {
                        console.log(`Using cached recommendations for user: ${currentUser}`);
                        const cached = JSON.parse(cachedRecommendations);

                        // Shuffle the cached results for variety each time
                        const shuffled = [...cached].sort(() => Math.random() - 0.5);

                        const cards = mapRecipeList({ recipes: shuffled }, "bg-darkBluePC");
                        setRecommendationCards(cards);
                        setRecommendationsLoading(false);
                        return;
                    }
                }

                // No valid cache - fetch from API
                console.log(`Fetching fresh recommendations for user: ${currentUser}`);
                const response = await getRecommendations();
                if (response.success && response.recipes) {
                    // Cache the results with user-specific keys
                    sessionStorage.setItem(cacheKey, JSON.stringify(response.recipes));
                    sessionStorage.setItem(cacheTimeKey, Date.now().toString());

                    const cards = mapRecipeList(response, "bg-darkBluePC");
                    setRecommendationCards(cards);
                } else {
                    console.log("No recommendations returned");
                }
            } catch (err) {
                console.log("Error fetching recommendations:", err);
            } finally {
                setRecommendationsLoading(false);
            }
        };

        const fetchFavorites = async () => {
            try {
                // TODO: Replace with actual API call to get favorites list
                setFavoriteCards(null);
            } catch (err) {
                console.log("Error fetching favorites:", err);
            }
        };

        fetchRecommendations();
        fetchFavorites();
    }, [currentUser]); // Re-run when user changes

    // --- Effect for fetching Categories on mount ---
    useEffect(() => {
        const getCategoryLists = async () => {
            try {
                // --- CATEGORY 1 ---
                const cat1Name = getRandomUniqueCategory();
                if (cat1Name) {
                    const recipes1 = await getRecipeCategory(cat1Name);
                    setCategory1({ name: cat1Name, recipes: recipes1 });
                }

                // --- CATEGORY 2 ---
                const cat2Name = getRandomUniqueCategory();
                if (cat2Name) {
                    const recipes2 = await getRecipeCategory(cat2Name);
                    setCategory2({ name: cat2Name, recipes: recipes2 });
                }

                // --- CATEGORY 3 ---
                const cat3Name = getRandomUniqueCategory();
                if (cat3Name) {
                    const recipes3 = await getRecipeCategory(cat3Name);
                    setCategory3({ name: cat3Name, recipes: recipes3 });
                }

                // --- CATEGORY 4 ---
                const cat4Name = getRandomUniqueCategory();
                if (cat4Name) {
                    const recipes4 = await getRecipeCategory(cat4Name);
                    setCategory4({ name: cat4Name, recipes: recipes4 });
                }

                // --- CATEGORY 5 ---
                const cat5Name = getRandomUniqueCategory();
                if (cat5Name) {
                    const recipes5 = await getRecipeCategory(cat5Name);
                    setCategory5({ name: cat5Name, recipes: recipes5 });
                }

            } catch (err) {
                console.log("Error fetching category recipes:", err);
            }
        };

        getCategoryLists();
    }, []); // Run only on mount

    // --- Effects to map fetched categories to cards ---
    useEffect(() => {
        if (category1) {
            const map = mapRecipeList(category1.recipes, "bg-darkBluePC");
            setCategory1Cards(map);
        }
    }, [category1]);

    useEffect(() => {
        if (category2) {
            const map = mapRecipeList(category2.recipes, "bg-darkBluePC");
            setCategory2Cards(map);
        }
    }, [category2]);

    useEffect(() => {
        if (category3) {
            const map = mapRecipeList(category3.recipes, "bg-darkBluePC");
            setCategory3Cards(map);
        }
    }, [category3]);

    useEffect(() => {
        if (category4) {
            const map = mapRecipeList(category4.recipes, "bg-darkBluePC");
            setCategory4Cards(map);
        }
    }, [category4]);

    useEffect(() => {
        if (category5) {
            const map = mapRecipeList(category5.recipes, "bg-darkBluePC");
            setCategory5Cards(map);
        }
    }, [category5]);

    // Return the mapped cards and the category names for titles
    return {
        recommendationCards,
        recommendationsLoading,
        favoriteCards,
        category1Cards,
        category1Name: category1 ? category1.name : null,
        category2Cards,
        category2Name: category2 ? category2.name : null,
        category3Cards,
        category3Name: category3 ? category3.name : null,
        category4Cards,
        category4Name: category4 ? category4.name : null,
        category5Cards,
        category5Name: category5 ? category5.name : null,
    };
};