import * as React from "react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

function MealCard({ recipe, mealType, activeDate, onClick }) {
    return (
        <div className="relative w-90 h-48 rounded-2xl overflow-hidden bg-lightGrayPC flex justify-center items-center">
            {/* Recipe image */}
            {recipe?.imageUrl && (
                <img
                    src={recipe.imageUrl}
                    alt={recipe.recipeName}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            )}

            {/* Title overlay */}
            {recipe?.recipeName && (
                <div className="absolute bottom-0 w-full bg-black/50 text-white text-lg font-bold text-center py-1">
                    {recipe.recipeName}
                </div>
            )}

            {/* Plus overlay */}
            <button
                onClick={() => onClick(mealType)}
                className="absolute inset-0 flex justify-center items-center"
            >
                <PlusCircleIcon className="w-1/3 h-1/3 stroke-lightGreenPC hover:stroke-lightBluePC" />
            </button>
        </div>
    );
}

export default MealCard;
