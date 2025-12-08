import * as React from "react";
import { useState, useEffect } from "react";
import MealCard from "./MealCard.jsx";
import { addMealPlan, removeMealPlan, getMealPlan } from "../services/api.js";

function InPageMealPlan({ activeDate, id ,close}) {
    const mealTypes = ["breakfast", "lunch", "dinner"];
    const [mealPlanByType, setMealPlanByType] = useState({
        breakfast: null,
        lunch: null,
        dinner: null,
    });

    // Fetch current meal plan for the active date
    useEffect(() => {
        async function fetchMeals() {
            const dateStr = activeDate.toISOString().split("T")[0]; // YYYY-MM-DD
            const result = await getMealPlan(dateStr);
            if (result.success) {
                const meals = { breakfast: null, lunch: null, dinner: null };
                result.mealPlan.forEach((meal) => {
                    meals[meal.mealType] = {
                        recipeId: meal.recipeId,
                        recipeName: meal.recipeName,
                        imageUrl: meal.imageUrl,
                    };
                });
                setMealPlanByType(meals);
            }
        }
        fetchMeals();
    }, [activeDate]);

    const handleAddOrReplace = async (mealType) => {
        const dateStr = activeDate.toISOString().split("T")[0];

        // Remove existing meal if there is one
        if (mealPlanByType[mealType]) {
            await removeMealPlan(dateStr, mealType);
        }

        // Add new meal
        const result = await addMealPlan(dateStr, mealType, id);
        if (result.success) {
            setMealPlanByType((prev) => ({
                ...prev,
                [mealType]: {
                    recipeId: id,
                    recipeName: "New Recipe", // TODO: fetch actual recipe info
                    imageUrl: "https://via.placeholder.com/400",
                },
            }));
        }

        close()
    };

    return (
        <div className="flex flex-col justify-center items-center gap-4.5 bg-darkBluePC h-full rounded-2xl p-4">
            <label className="text-white text-4xl font-bold p-2">
                {activeDate.toLocaleDateString()}
            </label>

            {mealTypes.map((mealType) => {
                const recipe = mealPlanByType[mealType]; // ✅ use mealPlanByType

                return (
                    <MealCard
                        key={mealType}
                        recipe={recipe}
                        mealType={mealType}
                        onClick={handleAddOrReplace} // ✅ fixed
                    />
                );
            })}
        </div>
    );
}

export default InPageMealPlan;
