import { createContext, useContext, useState, useEffect } from 'react';
import { getFavoritesList, addToFavorites, removeFromFavorites, generateFavoritesList } from '../services/api.js';

/**
 * Context for managing favorites across the application
 * Now connected to Bailey's Lists API (Favorites = special list with title "Favorites")
 */
const FavoritesContext = createContext();

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within FavoritesProvider');
    }
    return context;
};

export const FavoritesProvider = ({ children }) => {
    const [favoritesListId, setFavoritesListId] = useState(null);
    const [favoriteRecipeIds, setFavoriteRecipeIds] = useState([]);
    const [loading, setLoading] = useState(true);

    /**
     * Load favorites list from API on mount
     */
    useEffect(() => {
        loadFavorites();
    }, []);

    /**
     * Load the favorites list from the backend
     */
    const loadFavorites = async () => {
        setLoading(true);
        try {
            const response = await getFavoritesList();

            if (response.success && response.list) {
                setFavoritesListId(response.list.id);
                setFavoriteRecipeIds(response.list.recipe_ids || []);
            } else if (response.message === "Favorites list not found") {
                // Try to generate favorites list (in case signup didn't create it)
                const genResponse = await generateFavoritesList();
                if (genResponse.success && genResponse.list) {
                    setFavoritesListId(genResponse.list.list_id);
                    setFavoriteRecipeIds(genResponse.list.recipe_ids || []);
                }
            }
        } catch (error) {
            console.error("Failed to load favorites:", error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Check if a recipe is favorited
     */
    const isFavorited = (recipeId) => {
        return favoriteRecipeIds.includes(parseInt(recipeId));
    };

    /**
     * Add a recipe to favorites
     */
    const addFavorite = async (recipeId) => {
        if (!favoritesListId) {
            console.error("Favorites list ID not found");
            return false;
        }

        if (isFavorited(recipeId)) {
            return false; // Already favorited
        }

        try {
            const response = await addToFavorites(favoritesListId, parseInt(recipeId));

            if (response.success && response.list) {
                setFavoriteRecipeIds(response.list.recipe_ids || []);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Failed to add favorite:", error);
            return false;
        }
    };

    /**
     * Remove a recipe from favorites
     */
    const removeFavorite = async (recipeId) => {
        if (!favoritesListId) {
            console.error("Favorites list ID not found");
            return false;
        }

        try {
            const response = await removeFromFavorites(favoritesListId, parseInt(recipeId));

            if (response.success && response.list) {
                setFavoriteRecipeIds(response.list.recipe_ids || []);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Failed to remove favorite:", error);
            return false;
        }
    };

    /**
     * Toggle favorite status
     */
    const toggleFavorite = async (recipeId) => {
        if (isFavorited(recipeId)) {
            const success = await removeFavorite(recipeId);
            return !success; // Returns false if successfully removed (now unfavorited)
        } else {
            const success = await addFavorite(recipeId);
            return success; // Returns true if successfully added (now favorited)
        }
    };

    /**
     * Get list of favorited recipe IDs
     */
    const getFavoriteIds = () => {
        return favoriteRecipeIds;
    };

    /**
     * Clear favorites (on logout)
     */
    const clearFavorites = () => {
        setFavoritesListId(null);
        setFavoriteRecipeIds([]);
    };

    /**
     * Reload favorites from server
     */
    const reloadFavorites = async () => {
        await loadFavorites();
    };

    const value = {
        favoriteRecipeIds,
        loading,
        isFavorited,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        getFavoriteIds,
        clearFavorites,
        reloadFavorites
    };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
};