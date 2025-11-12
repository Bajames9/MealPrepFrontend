import { useState, useEffect } from "react";
import { getMissingIngredients } from "../services/api.js";
import { ShoppingCartIcon, CheckCircleIcon, PlusIcon } from "@heroicons/react/24/outline";

/**
 * Component to display missing pantry ingredients for a recipe
 * Shows loading skeleton while fetching, then displays missing ingredients
 */
function MissingIngredients({ recipeId }) {
    const [loading, setLoading] = useState(true);
    const [missingIngredients, setMissingIngredients] = useState([]);
    const [pantryItems, setHaveItems] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMissingIngredients = async () => {
            setLoading(true);
            try {
                const response = await getMissingIngredients(recipeId);
                if (response.success) {
                    setMissingIngredients(response.missing_ingredients || []);
                    setHaveItems(response.pantry_items || []);
                } else {
                    setError(response.message);
                }
            } catch (err) {
                console.error("Failed to fetch missing ingredients:", err);
                setError("Failed to load ingredient information");
            } finally {
                setLoading(false);
            }
        };

        if (recipeId) {
            fetchMissingIngredients();
        }
    }, [recipeId]);

    // Loading skeleton
    if (loading) {
        return (
            <div className="w-full bg-darkBluePC/30 rounded-2xl p-6 animate-pulse">
                <div className="h-8 w-48 bg-gray-600/50 rounded mb-4"></div>
                <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-6 bg-gray-600/30 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="w-full bg-red-500/20 rounded-2xl p-6">
                <p className="text-red-300 text-lg">{error}</p>
            </div>
        );
    }

    // Don't show anything if no ingredients data
    if (missingIngredients.length === 0 && pantryItems.length === 0) {
        return null;
    }

    return (
        <div className="w-full">
            {/* Missing Ingredients Section */}
            {missingIngredients.length > 0 && (
                <div className="bg-darkBluePC/80 rounded-2xl p-6 mb-4">
                    <div className="flex items-center gap-3 mb-4">
                        <ShoppingCartIcon className="w-8 h-8 text-red-400" />
                        <h3 className="text-white text-2xl font-bold">
                            Missing from Pantry ({missingIngredients.length})
                        </h3>
                    </div>
                    <ul className="space-y-2">
                        {missingIngredients.map((ingredient, index) => (
                            <li
                                key={index}
                                className="flex items-center justify-between bg-lightBluePC/30 rounded-lg p-3 hover:bg-lightBluePC/50 transition-colors"
                            >
                                <span className="text-white text-lg">{ingredient}</span>
                                {/* Placeholder button for grocery list (Sprint 3) */}
                                <button
                                    className="p-2 bg-lightGreenPC text-darkBluePC rounded-lg hover:bg-lightGreenPC/80 transition-colors cursor-not-allowed opacity-50"
                                    title="Add to Grocery List (Coming Soon)"
                                    disabled
                                >
                                    <PlusIcon className="w-5 h-5" />
                                </button>
                            </li>
                        ))}
                    </ul>
                    <p className="text-gray-400 text-sm mt-4 italic">
                        💡 Tip: Update your pantry to get accurate ingredient tracking
                    </p>
                </div>
            )}

            {/* Already Have Section */}
            {pantryItems.length > 0 && (
                <div className="bg-lightGreenPC/20 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <CheckCircleIcon className="w-8 h-8 text-lightGreenPC" />
                        <h3 className="text-white text-2xl font-bold">
                            You Have ({pantryItems.length})
                        </h3>
                    </div>
                    <ul className="grid grid-cols-2 gap-2">
                        {pantryItems.map((ingredient, index) => (
                            <li
                                key={index}
                                className="flex items-center gap-2 text-lightGreenPC text-lg"
                            >
                                <CheckCircleIcon className="w-5 h-5" />
                                <span>{ingredient}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default MissingIngredients;