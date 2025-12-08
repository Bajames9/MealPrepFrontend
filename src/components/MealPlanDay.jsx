import React, { useEffect, useState } from "react";
import RecipeCard from "./RecipeCard.jsx";
import {getMealPlan, removeMealPlan} from "../services/api.js";


const MEAL_SLOTS = ["breakfast", "lunch", "dinner"];

function MealPlanDay({ title, date }) {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!date) return;

        const fetchMealPlan = async () => {
            setLoading(true);

            const formattedDate = date.toISOString().split("T")[0];
            const response = await getMealPlan(formattedDate);

            if (response?.success) {
                setRecipes(response.mealPlan || []);
            } else {
                setRecipes([]);
            }

            setLoading(false);
        };

        fetchMealPlan();
    }, [date]);

    // ✅ Match recipes to fixed meal slots
    const mealsByType = {
        breakfast: recipes.find(r => r.mealType === "breakfast"),
        lunch: recipes.find(r => r.mealType === "lunch"),
        dinner: recipes.find(r => r.mealType === "dinner"),
    };

    // ✅ REMOVE HANDLER (HOOKED TO YOUR API)
    const handleRemoveFromMealPlan = async (mealType) => {
        const formattedDate = date.toISOString().split("T")[0];

        const response = await removeMealPlan(formattedDate, mealType);

        if (response?.success) {
            // ✅ Optimistically update UI
            setRecipes(prev =>
                prev.filter(r => r.mealType !== mealType)
            );
        } else {
            console.error("Failed to remove meal:", response?.message);
        }
    };

    return (
        <div className="flex flex-col items-center gap-3 bg-darkBluePC h-full rounded-2xl p-2">
            <label className="text-white text-4xl font-bold p-2">
                {title}
            </label>

            {loading && <p className="text-white">Loading...</p>}

            {!loading &&
                MEAL_SLOTS.map((mealType) => {
                    const recipe = mealsByType[mealType];

                    return recipe ? (
                        // ✅ REAL RECIPE CARD WITH REMOVE BUTTON
                        <RecipeCard
                            key={recipe.recipeId}
                            id={recipe.recipeId}
                            title={recipe.recipeName}
                            src={recipe.imageUrl}
                            size="mealPlan"
                            mode="mealPlan"
                            onRemove={() => handleRemoveFromMealPlan(mealType)} // ✅ PASS MEAL TYPE
                        />
                    ) : (
                        // ✅ EMPTY PLACEHOLDER SLOT
                        <div
                            key={mealType}
                            className="h-1/4 w-7/8 rounded-2xl border-2 border-dashed border-white/40
                         flex items-center justify-center text-white/50 text-xl italic"
                        >
                            {mealType.toUpperCase()} — Empty
                        </div>
                    );
                })}
        </div>
    );
}

export default MealPlanDay;
