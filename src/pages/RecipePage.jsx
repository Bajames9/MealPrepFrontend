import { useParams } from "react-router-dom";
import SideBar from "../components/SideBar.jsx";
import React, { useEffect, useState } from "react";
import { getRecipe, getAllUserLists, getList, updateList, createList } from "../services/api.js";
import Ratings from "../components/Ratings.jsx";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useFavorites } from "../contexts/FavoritesContext.jsx";
// import MissingIngredients from "../components/MissingIngredients.jsx";
import { getMissingIngredients } from "../services/api.js";
import { CheckCircleIcon } from "@heroicons/react/24/outline";


/**
 * Recipe Page used to display information about a specific recipe
 * @returns {React.JSX.Element}
 * @constructor
 */
function RecipePage() {

    // used to get the id of the recipe being displayed gotten from page url /recipe/${id}
    const { id } = useParams();
    // used to store api response about recipe
    const [recipe, setRecipe] = useState("")

    // Favorites functionality
    const { isFavorited, toggleFavorite } = useFavorites();
    const favorited = isFavorited(parseInt(id));
    const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

    // Add to List functionality
    const [showListModal, setShowListModal] = useState(false);
    const [userLists, setUserLists] = useState([]);
    const [loadingLists, setLoadingLists] = useState(false);
    const [addingToList, setAddingToList] = useState(null);

    // Create new list in modal
    const [showCreateInModal, setShowCreateInModal] = useState(false);
    const [newListTitle, setNewListTitle] = useState("");
    const [createError, setCreateError] = useState("");

    // missing ingredients
    const [missingIngredients, setMissingIngredients] = useState([]);
    const [loadingIngredients, setLoadingIngredients] = useState(false);


    // gets the api response for the recipe to be displayed
    useEffect(() => {
        const getRecipeFromID = async () => {
            try {
                // gets recipe based on id
                const data = await getRecipe(id);
                if (data.success) {
                    // sets the recipe
                    setRecipe(data.recipe);
                }
            } catch (err) {
                console.error("Recipe fetch failed:", err);
            }
        };
        getRecipeFromID();
    }, [id]);

    // Fetch missing ingredients when recipe loads
    useEffect(() => {
        const fetchMissingIngredients = async () => {
            if (!recipe || !recipe.id) return;

            setLoadingIngredients(true);
            try {
                const response = await getMissingIngredients(recipe.id);
                if (response.success) {
                    // Store missing ingredient names in lowercase for comparison
                    const missing = (response.missing_ingredients || []).map(ing => ing.toLowerCase().trim());
                    setMissingIngredients(missing);
                }
            } catch (err) {
                console.error("Failed to fetch missing ingredients:", err);
            } finally {
                setLoadingIngredients(false);
            }
        };

        fetchMissingIngredients();
    }, [recipe]);

    const isIngredientMissing = (ingredient) => {
        if (loadingIngredients || !ingredient) return false;

        const ingredientLower = ingredient.toLowerCase().trim();

        // Check if this ingredient matches any missing ingredient
        return missingIngredients.some(missing => {
            return ingredientLower.includes(missing) || missing.includes(ingredientLower);
        });
    };

    // Handle favorite button click
    const handleFavoriteClick = async () => {
        if (!recipe || isTogglingFavorite) return;

        setIsTogglingFavorite(true);
        try {
            await toggleFavorite(parseInt(recipe.id));
        } catch (error) {
            console.error("Failed to toggle favorite:", error);
        } finally {
            setIsTogglingFavorite(false);
        }
    };

    // Load user lists when modal opens
    const handleOpenListModal = async () => {
        setShowListModal(true);
        setShowCreateInModal(false);
        setNewListTitle("");
        setCreateError("");
        setLoadingLists(true);
        try {
            const response = await getAllUserLists();
            if (response.success && response.list_ids) {
                // Fetch details for each list (excluding Favorites)
                const listPromises = response.list_ids.map(id => getList(id));
                const listResponses = await Promise.all(listPromises);

                const lists = listResponses
                    .filter(res => res.success && res.list && res.list.title !== "Favorites")
                    .map(res => res.list);

                setUserLists(lists);
            }
        } catch (err) {
            console.error("Failed to load lists:", err);
        } finally {
            setLoadingLists(false);
        }
    };

    // Add recipe to a list
    const handleAddToList = async (listId, listTitle) => {
        setAddingToList(listId);
        try {
            const response = await updateList(listId, { recipe_ids: [parseInt(recipe.id)] });
            if (response.success) {
                alert(`Added to "${listTitle}"!`);
                setShowListModal(false);
            } else {
                alert("Failed to add to list");
            }
        } catch (err) {
            console.error("Failed to add to list:", err);
            alert("Failed to add to list");
        } finally {
            setAddingToList(null);
        }
    };

    // Create new list and add current recipe
    const handleCreateAndAdd = async () => {
        const trimmedTitle = newListTitle.trim();

        if (!trimmedTitle) {
            setCreateError("Please enter a list name");
            return;
        }

        if (trimmedTitle.toLowerCase() === "favorites") {
            setCreateError("'Favorites' is a reserved name. Please choose another.");
            return;
        }

        setAddingToList("creating");
        try {
            // Create list with current recipe
            const response = await createList(trimmedTitle, [parseInt(recipe.id)]);
            if (response.success) {
                alert(`Created "${trimmedTitle}" and added recipe!`);
                setShowListModal(false);
            } else {
                setCreateError(response.message || "Failed to create list");
            }
        } catch (err) {
            console.error("Failed to create list:", err);
            setCreateError("Failed to create list");
        } finally {
            setAddingToList(null);
        }
    };


    // used to convert api format for recipe cook time to a human-readable format
    function parseDuration(duration) {
        const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
        const hours = parseInt(match[1] || 0, 10);
        const minutes = parseInt(match[2] || 0, 10);
        return { hours, minutes };
    }


    // formats recipe Instructions
    function parseInstructions(instructionString) {
        if (Array.isArray(instructionString)) {
            return instructionString;
        }
        if (!instructionString) {
            return [];
        }

        return instructionString.split(/\s*,\s*/).filter(item => item.trim() !== "");
    }


    // Insures List is in the correct format
    function parseList(listString) {
        if (Array.isArray(listString)) {
            return listString.map(item => (item === "NA" || item === "null" ? null : item));
        }
        if (!listString) {
            return [];
        }
        // Assuming string is now a comma-separated list of items
        const items = listString.split(/\s*,\s*/);
        return items.map(item => (item === "NA" || item === "null" ? null : item.trim()));
    }


    // Formats the ingredients and quantity together to be displayed as bullet list
    function combineIngredients(quantities, ingredients) {
        const qArr = parseList(quantities);
        const iArr = parseList(ingredients);
        const length = Math.max(qArr.length, iArr.length);

        const combined = [];
        for (let i = 0; i < length; i++) {
            const quantity = qArr[i];
            const ingredient = iArr[i];
            if (!ingredient) continue; // skip if ingredient missing
            combined.push({
                // Check for null or "NA" string from the parsed list
                quantity: quantity && quantity !== "NA" ? quantity : "",
                ingredient,
            });
        }
        return combined;
    }

    //React Code
    return <div className="bg-lightBluePC w-full h-full">
        <div className="w-full h-full  flex ">
            <SideBar className="font-black bg-darkBluePC/65 absolute z-10"
            />
            <div className="flex flex-col justify-center items-center w-full">
                {/*Displays the top bar content title rating category and description*/}
                <div className="w-full flex flex-col justify-center items-center text-4xl text-white space-y-2">
                    <p>{recipe.name}</p>
                    <div className="flex flex-row">
                        {/*Custom rating component turns a long between 0 and 5.0 into a 5 start display*/}
                        <div><Ratings rating={recipe.rating} /> </div>
                        <p className="text-lg">({recipe.reviewCount}) {recipe.category}</p>
                    </div>
                    <p className="text-xl w-1/2 mb-4">{recipe.description}</p>
                </div>
                <hr className=" border-darkBluePC w-1/2" />
                <div className="w-full h-7/8 flex flex-col items-center gap-4 m-2">
                    {/*Action buttons*/}
                    <div className="flex flex-row gap-4 text-white text-4xl">
                        {/* Favorite Button */}
                        <button
                            onClick={handleFavoriteClick}
                            disabled={isTogglingFavorite}
                            className={`h-20 w-50 bg-lightGreenPC rounded-lg drop-shadow-2xl hover:text-lightGreenPC hover:bg-overlayPC flex items-center justify-center gap-2 ${isTogglingFavorite ? 'opacity-50 cursor-wait' : ''}`}
                        >
                            {favorited ? (
                                <>
                                    <HeartSolid className="w-8 h-8 text-red-500" />
                                    <span>Favorited</span>
                                </>
                            ) : (
                                <>
                                    <HeartOutline className="w-8 h-8" />
                                    <span>Favorite</span>
                                </>
                            )}
                        </button>

                        {/* Add to List Button */}
                        <button
                            onClick={handleOpenListModal}
                            className="h-20 w-50 bg-lightGreenPC rounded-lg drop-shadow-2xl hover:text-lightGreenPC hover:bg-overlayPC flex items-center justify-center gap-2"
                        >
                            <PlusIcon className="w-8 h-8" />
                            <span>Add to List</span>
                        </button>

                        <button className="h-20 w-50 bg-lightGreenPC rounded-lg drop-shadow-2xl hover:text-lightGreenPC hover:bg-overlayPC ">Download</button>
                        <button className="h-20 w-50 bg-lightGreenPC rounded-lg drop-shadow-2xl hover:text-lightGreenPC hover:bg-overlayPC ">Print</button>
                        <button className="h-20 w-50 bg-lightGreenPC rounded-lg drop-shadow-2xl hover:text-lightGreenPC hover:bg-overlayPC ">Share</button>
                    </div>

                    <img
                        alt="IMG of Food"
                        src={recipe.images}
                        className="h-115 w-1/2 object-cover rounded-2xl"
                    />
                    <div className="flex flex-row justify-between w-1/2 text-white text-2xl">

                        <p>Ready In: {recipe.totalTime && (() => {
                            const { hours, minutes } = parseDuration(recipe.totalTime);
                            return <p>{hours ? `${hours}h ` : ""}{minutes}m</p>;
                        })()}</p>

                        {recipe.servings && <p> Serves: {recipe.servings}</p>}


                    </div>
                    <hr className=" border-darkBluePC w-1/2" />
                    {/*Displays the list of instructions and ingredients in a side by side list*/}
                    <div className="flex flex-row justify-between w-1/2 text-2xl text-white">
                        {/* Instructions List (Ordered) */}
                        <ol className="list-decimal list-inside text-white w-1/2">
                            {recipe.instructions && parseInstructions(recipe.instructions).map((step, index) => (
                                <li className="p-2" key={index}>{step}</li>
                            ))}
                        </ol>

                        {/* Enhanced Ingredients List with Pantry Tracking */}
                        <div className="w-1/2">
                            <h3 className="text-2xl font-bold mb-3 text-lightGreenPC">Ingredients</h3>

                            {loadingIngredients ? (
                                // Loading skeleton
                                <div className="space-y-2">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="h-8 bg-gray-600/30 rounded animate-pulse"></div>
                                    ))}
                                </div>
                            ) : (
                                <ul className="space-y-2">
                                    {combineIngredients(recipe.quantities, recipe.ingredients).map((item, index) => {
                                        const fullIngredient = `${item.quantity && item.quantity !== "-" ? `${item.quantity} ` : ""}${item.ingredient}`;
                                        const isMissing = isIngredientMissing(item.ingredient);

                                        return (
                                            <li
                                                key={index}
                                                className={`flex items-center justify-between p-2 rounded-lg transition-colors ${isMissing
                                                    ? 'bg-red-500/20 hover:bg-red-500/30'
                                                    : 'bg-lightGreenPC/20 hover:bg-lightGreenPC/30'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2 flex-1">
                                                    {isMissing ? (
                                                        <div className="w-6 h-6 flex-shrink-0" /> // Empty space for alignment
                                                    ) : (
                                                        <CheckCircleIcon className="w-6 h-6 text-lightGreenPC flex-shrink-0" />
                                                    )}
                                                    <span className={isMissing ? 'text-red-200' : 'text-white'}>
                                                        {fullIngredient}
                                                    </span>
                                                </div>

                                                {/* Add to Grocery List button - only show for missing items */}
                                                {isMissing && (
                                                    <button
                                                        className="p-2 bg-lightGreenPC/50 text-white rounded-lg hover:bg-lightGreenPC/70 transition-colors cursor-not-allowed opacity-50 flex-shrink-0"
                                                        title="Add to Grocery List (Coming Soon)"
                                                        disabled
                                                    >
                                                        <PlusIcon className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}

                            {!loadingIngredients && missingIngredients.length > 0 && (
                                <p className="text-black text-sm mt-4 italic">
                                    💡 Missing items shown in red. Update your pantry for accurate tracking.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Add to List Modal */}
        {showListModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-lightGreenPC rounded-2xl p-8 w-full max-w-md max-h-[80vh] overflow-y-auto">
                    <h2 className="text-darkBluePC text-3xl font-bold mb-6">Add to List</h2>

                    {loadingLists ? (
                        <p className="text-darkBluePC text-xl">Loading lists...</p>
                    ) : showCreateInModal ? (
                        /* Create New List Form */
                        <div>
                            <h3 className="text-darkBluePC text-xl font-bold mb-4">Create New List</h3>

                            {createError && (
                                <div className="bg-red-400 text-white p-3 rounded-lg mb-4 text-sm">
                                    {createError}
                                </div>
                            )}

                            <input
                                type="text"
                                placeholder="List name (e.g., Weeknight Dinners)"
                                value={newListTitle}
                                onChange={(e) => setNewListTitle(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleCreateAndAdd();
                                }}
                                className="w-full p-3 rounded-lg bg-darkBluePC text-white text-lg mb-4"
                                autoFocus
                            />

                            <div className="space-y-2">
                                <button
                                    onClick={handleCreateAndAdd}
                                    disabled={addingToList === "creating"}
                                    className="w-full py-3 bg-darkBluePC text-white font-bold rounded-lg hover:bg-overlayPC disabled:opacity-50"
                                >
                                    {addingToList === "creating" ? "Creating..." : "Create & Add Recipe"}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowCreateInModal(false);
                                        setNewListTitle("");
                                        setCreateError("");
                                    }}
                                    className="w-full py-3 bg-lightGrayPC text-white font-bold rounded-lg hover:bg-overlayPC"
                                >
                                    Back to Lists
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Existing Lists + Create Button */
                        <div className="space-y-3">
                            {/* Create New List Button */}
                            <button
                                onClick={() => setShowCreateInModal(true)}
                                className="w-full p-4 bg-lightGreenPC border-2 border-darkBluePC text-darkBluePC text-xl font-bold rounded-lg hover:bg-darkBluePC hover:text-white transition-colors flex items-center justify-center gap-2"
                            >
                                <PlusIcon className="w-6 h-6" />
                                Create New List
                            </button>

                            {userLists.length > 0 && (
                                <>
                                    <div className="text-darkBluePC text-center py-2">or add to existing:</div>

                                    {userLists.map((list) => (
                                        <button
                                            key={list.list_id}
                                            onClick={() => handleAddToList(list.list_id, list.title)}
                                            disabled={addingToList === list.list_id}
                                            className="w-full p-4 bg-darkBluePC text-white text-xl font-bold rounded-lg hover:bg-overlayPC transition-colors disabled:opacity-50 disabled:cursor-wait text-left"
                                        >
                                            {list.title}
                                            <span className="text-sm text-lightGreenPC block mt-1">
                                                {list.recipe_ids?.length || 0} recipes
                                            </span>
                                        </button>
                                    ))}
                                </>
                            )}

                            <button
                                onClick={() => setShowListModal(false)}
                                className="w-full py-3 bg-lightGrayPC text-white font-bold rounded-lg hover:bg-overlayPC mt-4"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
}
export default RecipePage