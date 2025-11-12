import SideBar from "../components/SideBar.jsx";
import RecipeCard from "../components/RecipeCard.jsx";
import { useFavorites } from "../contexts/FavoritesContext.jsx";
import { HeartIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import { getRecipe } from "../services/api.js";

/**
 * Favorites page - displays all recipes the user has favorited
 * Fetches full recipe details from the recipe IDs in favorites list
 * @returns {React.JSX.Element}
 * @constructor
 */
function Favorites() {
    const { favoriteRecipeIds, loading: favoritesLoading } = useFavorites();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch full recipe details when favorite IDs change
    useEffect(() => {
        const fetchRecipes = async () => {
            if (favoriteRecipeIds.length === 0) {
                setRecipes([]);
                return;
            }

            setLoading(true);
            try {
                // Fetch all recipe details
                const recipePromises = favoriteRecipeIds.map(id => getRecipe(id));
                const responses = await Promise.all(recipePromises);

                // Filter successful responses and extract recipe data
                const fetchedRecipes = responses
                    .filter(res => res.success && res.recipe)
                    .map(res => res.recipe);

                setRecipes(fetchedRecipes);
            } catch (error) {
                console.error("Failed to fetch recipe details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, [favoriteRecipeIds]);

    const isLoading = favoritesLoading || loading;

    return (
        <div className="bg-lightBluePC w-full min-h-screen">
            <div className="w-full h-full flex">
                {/* Sidebar for navigation */}
                <SideBar className="font-black bg-darkBluePC/65 absolute z-10" />

                {/* Main content area */}
                <div className="flex flex-col items-center w-full p-8">
                    {/* Page Title */}
                    <div className="flex items-center gap-4 mb-8">
                        <HeartIcon className="w-16 h-16 text-red-500" />
                        <h1 className="font-bold text-white text-6xl">My Favorites</h1>
                    </div>

                    {/* Loading State */}
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center mt-20">
                            <p className="text-white text-3xl">Loading favorites...</p>
                        </div>
                    ) : recipes.length === 0 ? (
                        /* Empty State */
                        <div className="flex flex-col items-center justify-center mt-20">
                            <HeartIcon className="w-32 h-32 text-lightGrayPC mb-4" />
                            <p className="text-white text-3xl text-center">
                                No favorites yet!
                            </p>
                            <p className="text-lightGreenPC text-xl text-center mt-2">
                                Browse recipes and click the heart icon to save your favorites here.
                            </p>
                        </div>
                    ) : (
                        /* Favorites Grid with better spacing */
                        <div className="w-full max-w-7xl">
                            <p className="text-lightGreenPC text-2xl mb-6">
                                {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'} saved
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-90 gap-y-8">
                                {recipes.map((recipe) => (
                                    <RecipeCard
                                        key={recipe.id}
                                        className="bg-darkBluePC"
                                        src={recipe.images}
                                        title={recipe.name}
                                        id={recipe.id}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Favorites;