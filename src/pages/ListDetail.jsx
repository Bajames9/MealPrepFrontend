import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar.jsx";
import RecipeCard from "../components/RecipeCard.jsx";
import { getList, getRecipe, removeRecipesFromList, updateList } from "../services/api.js"; // ADD updateList import
import { ArrowLeftIcon, TrashIcon } from "@heroicons/react/24/outline";

/**
 * List Detail page - View and manage recipes in a specific list
 * @returns {React.JSX.Element}
 * @constructor
 */
function ListDetail() {
    const { listId } = useParams();
    const navigate = useNavigate();

    const [list, setList] = useState(null);
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removingRecipeId, setRemovingRecipeId] = useState(null);
    const [togglingPrivacy, setTogglingPrivacy] = useState(false);

    useEffect(() => {
        loadListAndRecipes();
    }, [listId]);

    /**
     * Load list details and fetch recipe information
     */
    const loadListAndRecipes = async () => {
        setLoading(true);
        try {
            // Get list details
            const listResponse = await getList(parseInt(listId));
            if (!listResponse.success || !listResponse.list) {
                navigate("/lists");
                return;
            }

            setList(listResponse.list);

            // Fetch recipe details for all recipe IDs
            if (listResponse.list.recipe_ids && listResponse.list.recipe_ids.length > 0) {
                const recipePromises = listResponse.list.recipe_ids.map(id => getRecipe(id));
                const recipeResponses = await Promise.all(recipePromises);

                const loadedRecipes = recipeResponses
                    .filter(res => res.success && res.recipe)
                    .map(res => res.recipe);

                setRecipes(loadedRecipes);
            } else {
                setRecipes([]);
            }
        } catch (err) {
            console.error("Failed to load list:", err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Remove a recipe from the list
     */
    const handleRemoveRecipe = async (recipeId, recipeName) => {
        const confirmed = window.confirm(`Remove "${recipeName}" from this list?`);
        if (!confirmed) return;

        setRemovingRecipeId(recipeId);
        try {
            const response = await removeRecipesFromList(list.list_id, [recipeId]);
            if (response.success) {
                // Reload list
                loadListAndRecipes();
            } else {
                alert("Failed to remove recipe");
            }
        } catch (err) {
            console.error("Failed to remove recipe:", err);
            alert("Failed to remove recipe");
        } finally {
            setRemovingRecipeId(null);
        }
    };

    /**
     * Toggle list privacy between public and private
     */
    const handleTogglePrivacy = async () => {
        if (!list) {
            console.error("List not loaded");
            return;
        }

        if (list.title === "Favorites") {
            alert("Cannot change privacy of Favorites list");
            return;
        }

        setTogglingPrivacy(true);
        try {
            const response = await updateList(list.list_id, { public: !list.public });
            if (response.success) {
                // Reload to show updated status
                await loadListAndRecipes();
            } else {
                alert("Failed to update privacy setting");
            }
        } catch (err) {
            console.error("Failed to toggle privacy:", err);
            alert("Failed to update privacy setting");
        } finally {
            setTogglingPrivacy(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-lightBluePC w-full min-h-screen flex items-center justify-center">
                <p className="text-white text-3xl">Loading...</p>
            </div>
        );
    }

    if (!list) {
        return (
            <div className="bg-lightBluePC w-full min-h-screen flex items-center justify-center">
                <p className="text-white text-3xl">List not found</p>
            </div>
        );
    }

    return (
        <div className="bg-lightBluePC w-full min-h-screen">
            <div className="w-full h-full flex">
                <SideBar className="font-black bg-darkBluePC/65 absolute z-10" />

                <div className="flex flex-col items-center w-full p-8">
                    {/* Header with back button */}
                    <div className="w-full max-w-6xl mb-8">
                        <button
                            onClick={() => navigate("/lists")}
                            className="flex items-center gap-2 text-white text-xl mb-4 hover:text-lightGreenPC"
                        >
                            <ArrowLeftIcon className="w-6 h-6" />
                            Back to Lists
                        </button>

                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="font-bold text-white text-5xl">{list.title}</h1>
                                <p className="text-lightGreenPC text-2xl mt-2">
                                    {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'}
                                </p>
                            </div>

                            {/* Privacy Toggle Button */}
                            <button
                                onClick={handleTogglePrivacy}
                                disabled={togglingPrivacy || list.title === "Favorites"}
                                className={`px-6 py-3 rounded-lg transition-colors ${list.public
                                        ? 'bg-lightGreenPC text-darkBluePC hover:bg-lightGreenPC/80'
                                        : 'bg-darkBluePC/80 text-white hover:bg-overlayPC'
                                    } ${togglingPrivacy ? 'opacity-50 cursor-wait' : ''} ${list.title === "Favorites" ? 'cursor-not-allowed opacity-50' : ''
                                    }`}
                            >
                                <p className="text-lg font-bold">
                                    Privacy: {togglingPrivacy ? 'Updating...' : (list.public ? 'Public' : 'Private')}
                                </p>
                                {list.title !== "Favorites" && (
                                    <p className="text-sm mt-1">Click to change</p>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Recipes Grid */}
                    {recipes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center mt-20">
                            <p className="text-white text-3xl text-center">No recipes in this list yet</p>
                            <p className="text-lightGreenPC text-xl text-center mt-2">
                                Browse recipes and add them to this list
                            </p>
                        </div>
                    ) : (
                        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-90 gap-y-8">
                            {recipes.map((recipe) => (
                                <div key={recipe.id} className="relative">
                                    <RecipeCard
                                        className="bg-darkBluePC"
                                        src={recipe.images}
                                        title={recipe.name}
                                        id={recipe.id}
                                    />
                                    {/* Remove button overlay */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveRecipe(recipe.id, recipe.name);
                                        }}
                                        disabled={removingRecipeId === recipe.id}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg disabled:opacity-50"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ListDetail;