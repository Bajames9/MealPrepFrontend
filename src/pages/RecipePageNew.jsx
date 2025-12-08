import SideBar from "../components/SideBar.jsx";
import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {getRecipe} from "../services/api.js";
import Ratings from "../components/Ratings.jsx";
import RecipeInstructions from "../components/recipeInstructions.jsx";
import RecipeIngredients from "../components/recipeIngredients.jsx";
import AddToListModal from "../components/AddToListModal.jsx";

import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { PlusIcon } from "@heroicons/react/24/outline";
import {useFavorites} from "../contexts/FavoritesContext.jsx";
import AddToMealPLan from "./AddToMealPLan.jsx";


function RecipePageNew(){

    const { id } = useParams();
    const [recipe, setRecipe] = useState("")

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






    const { isFavorited, toggleFavorite } = useFavorites();
    const favorited = isFavorited(parseInt(id));
    const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

    // Add to List functionality
    const [showListModal, setShowListModal] = useState(false);


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
    const handleOpenListModal = () => setShowListModal(true);


    const [showMealPlanModal, setShowMealPlanModal] = useState(false);
    const handleOpenMealPlanModal= () => setShowMealPlanModal(true)





    const handleDownloadRecipe = () => {
        if (!recipe) {
            alert("Recipe data is not loaded yet!");
            return;
        }

        // --- Ingredients ---
        let ingredientsText = [];
        try {
            if (recipe.ingredients && recipe.quantities && recipe.ingredientsParts) {
                const ingredientsArr = JSON.parse(recipe.ingredients);
                const quantitiesArr = JSON.parse(recipe.quantities);
                const partsArr = recipe.ingredientsParts.split(",").map(p => p.trim());

                let templateIndex = 0;

                for (let i = 0; i < ingredientsArr.length; i++) {
                    let ingredient = ingredientsArr[i]?.trim() || "";
                    const quantity = quantitiesArr[i]?.trim() || "";

                    if (ingredient.includes("$template1$") && partsArr[templateIndex]) {
                        const part = partsArr[templateIndex].trim();
                        ingredient = ingredient.replace(/\$template1\$/g, part);
                        templateIndex++;
                    }

                    if (ingredient) {
                        ingredientsText.push(`${quantity} ${ingredient}`.trim());
                    }
                }
            }
        } catch (err) {
            console.error("Error formatting ingredients for download:", err);
        }

        // --- Instructions ---
        let instructionsText = [];
        try {
            if (recipe.instructions) {
                const parsedInstructions = JSON.parse(recipe.instructions);
                if (Array.isArray(parsedInstructions)) {
                    instructionsText = parsedInstructions.map((step, idx) =>
                        `${idx + 1}. ${step.replace(/&quot;/g, '"')}`
                    );
                }
            }
        } catch (err) {
            console.error("Error formatting instructions for download:", err);
        }

        // --- Combine everything ---
        const textContent = `
            Recipe: ${recipe.name}
            
            Description: ${recipe.description || "No description"}
            
            Category: ${recipe.category || "N/A"}
            Rating: ${recipe.rating || "N/A"} (${recipe.reviewCount || 0} reviews)
            
            Ingredients:
            ${ingredientsText.join("\n")}
            
            Instructions:
            ${instructionsText.join("\n")}
            `;

        // --- Trigger download ---
        const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", `${recipe.name.replace(/\s+/g, "_")}.txt`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };












    return <div className="bg-lightBluePC w-full h-screen">
        <div className="w-full h-full  flex ">
            <SideBar    className="font-black bg-darkBluePC/65 absolute z-10"/>
            <div className="flex justify-center items-center w-full">


                <div className='flex flex-row gap-4 w-7/8 h-7/8'>
                    <div className="flex flex-col w-3/8 gap-4 h-full">
                        <div className='flex flex-col w-full h-1/8 text-4xl text-white font-bold justify-center items-center'>
                            {recipe.name}
                            <div className="flex flex-row">
                                {/*Custom rating component turns a long between 0 and 5.0 into a 5 start display*/}
                                <div><Ratings rating={recipe.rating} /> </div>
                                <p className="text-lg">({recipe.reviewCount}) {recipe.category}</p>
                            </div>
                        </div>
                        <div className="relative w-full rounded-2xl overflow-hidden">
                            <img className="w-full h-full object-cover" src={recipe.images} alt="Recipe" />

                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

                            {/* Text content */}
                            <div className="absolute bottom-4 left-4 text-white">
                                <h2 className="text-xl font-bold">{recipe.name}</h2>
                                <p className="text-sm">{recipe.description}</p>
                            </div>
                        </div>



                        <div className="flex flex-row justify-center w-full h-1/8 gap-4 ">
                            <button
                                onClick={handleFavoriteClick}
                                disabled={isTogglingFavorite}
                                className={`w-1/5 h-full bg-lightGreenPC rounded-lg drop-shadow-2xl hover:text-lightGreenPC hover:bg-overlayPC flex items-center justify-center gap-2 ${isTogglingFavorite ? 'opacity-50 cursor-wait' : ''}`}
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
                            <button
                                onClick={handleOpenListModal}
                                className="w-1/5 h-full bg-lightGreenPC rounded-lg drop-shadow-2xl hover:text-lightGreenPC hover:bg-overlayPC flex items-center justify-center gap-2"
                            >
                                <PlusIcon className="w-8 h-8" />
                                <span>Add to List</span>
                            </button>
                            <button onClick={handleOpenMealPlanModal} className="w-1/5 h-full bg-lightGreenPC rounded-lg drop-shadow-2xl hover:text-lightGreenPC hover:bg-overlayPC flex items-center justify-center gap-2">Save to Meal Plan</button>
                            <button
                                type="button"
                                onClick={handleDownloadRecipe}
                                className="w-1/5 h-full bg-lightGreenPC rounded-lg drop-shadow-2xl hover:text-lightGreenPC hover:bg-overlayPC flex items-center justify-center gap-2"
                            >
                                Download Recipe
                            </button>

                        </div>
                    </div>
                    <div className="bg-lightGrayPC w-5/8 h-full rounded-2xl overflow-y-auto p-4">
                        <div className=" flex flex-row h-full gap-4 ">
                            <div className="flex flex-col text-white  m-5 text-xl font-bold w-1/2 h-full">
                                <RecipeInstructions recipe={recipe}/>
                            </div>
                            <div className="flex flex-col text-white  m-5 text-xl font-bold w-1/2 h-full">
                                <RecipeIngredients recipe={recipe}/>
                            </div>
                        </div>


                    </div>
                </div>
            </div>

        </div>

        {showListModal && (
            <AddToListModal
                recipeId={recipe.id}
                onClose={() => setShowListModal(false)}
            />
        )}

        {showMealPlanModal && (
            <AddToMealPLan
                id={id}
                onClose={() => setShowMealPlanModal(false)} // <-- pass down
            />
        )}

    </div>
}
export  default RecipePageNew