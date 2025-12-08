import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { MinusCircleIcon } from "@heroicons/react/24/solid";

import { useFavorites } from "../contexts/FavoritesContext.jsx";

/**
 * Used to Display A Recipe
 * Now includes hover heart button for favoriting
 * @param className
 * @param src
 * @param title
 * @param id
 * @returns {React.JSX.Element}
 * @constructor
 */
function RecipeCard({ className, src, title, id, size = "normal", mode = "default", onRemove }) {
    const navigate = useNavigate();
    const { isFavorited, toggleFavorite } = useFavorites();
    const [isHovered, setIsHovered] = useState(false);
    const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

    const url = src;
    const favorited = isFavorited(parseInt(id));

    const sizeClasses = {
        normal: "h-75 w-100",
        small: "h-56 w-75",
        mealPlan: "h-1/4 w-7/8",
        inPage: "h-49 w-90"
    };

    const handleFavoriteClick = async (e) => {
        e.stopPropagation();
        if (isTogglingFavorite) return;
        setIsTogglingFavorite(true);

        try {
            await toggleFavorite(parseInt(id));
        } finally {
            setIsTogglingFavorite(false);
        }
    };

    const handleRemoveClick = async (e) => {
        e.stopPropagation();
        if (!onRemove) return;
        await onRemove(); // ✅ This triggers removeMealPlan()
    };




    return (
        <div
            className={`flex flex-row ${sizeClasses[size]} rounded-2xl m-2 overflow-hidden relative shadow-xl ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Main clickable area */}
            <a href={`/recipe/${id}`} className="w-8/10 h-full relative block cursor-pointer">
                <img alt={title} src={url} className="h-full w-full object-cover" />
                <div className="absolute w-full inset-0 bg-gradient-to-t from-transparent to-black/50">
                    <p className="text-white text-2xl font-bold flex flex-row justify-center m-2">{title}</p>
                </div>
            </a>

            {/* Right-side action strip */}
            <div className="w-2/10 h-full bg-[var(--color-lightGrayPC)] flex items-center justify-center relative">
                {mode === "mealPlan" ? (
                    <button
                        onClick={handleRemoveClick}
                        className={`transition-opacity duration-200 ${
                            isHovered ? "opacity-100" : "opacity-0"
                        } hover:scale-110 transform transition-transform`}
                    >
                        <MinusCircleIcon className="w-12 h-12 text-red-500 hover:text-red-400" />
                    </button>
                ) : (
                    // ✅ FAVORITES MODE (DEFAULT)
                    <button
                        onClick={handleFavoriteClick}
                        disabled={isTogglingFavorite}
                        className={`transition-opacity duration-200 ${
                            isHovered ? "opacity-100" : "opacity-0"
                        } ${isTogglingFavorite ? "cursor-wait" : "cursor-pointer"} 
                        hover:scale-110 transform transition-transform`}
                    >
                        {favorited ? (
                            <HeartSolid className="w-12 h-12 text-red-500" />
                        ) : (
                            <HeartOutline className="w-12 h-12 text-white hover:text-red-300" />
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}

export default RecipeCard;
