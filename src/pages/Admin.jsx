import SideBar from "../components/SideBar.jsx";
import Ratings from "../components/Ratings.jsx";

import RecipeInstructions from "../components/recipeInstructions.jsx";
import RecipeIngredients from "../components/recipeIngredients.jsx";
import React, {useState} from "react";
import {approveUserRecipe, getAllSubmittedUserRecipesAdmin, unsubmitUserRecipe} from "../services/api.js";


function Admin() {
    const [recipe, setRecipe] = useState(null);
    const [submittedRecipes, setSubmittedRecipes] = useState([]);
    const [showLoadMenu, setShowLoadMenu] = useState(false);

    // ✅ Load submitted recipes from backend
    const loadSubmittedRecipes = async () => {
        const result = await getAllSubmittedUserRecipesAdmin();

        if (result.success) {
            setSubmittedRecipes(result.recipes);
            setShowLoadMenu(true); // ✅ OPEN MENU
        } else {
            alert(result.message);
        }
    };

    // ✅ When clicking a recipe in the menu
    const loadRecipeIntoView = (recipeData, recipeId) => {
        setRecipe({ ...recipeData, id: recipeId }); // merge ID into state
        setShowLoadMenu(false);
    };


    return (
        <div className="bg-lightBluePC w-full h-screen">
            <div className="w-full h-full flex">
                <SideBar className="font-black bg-darkBluePC/65 absolute z-10" />

                <div className="flex justify-center items-center w-full">


                    <div className='flex flex-row gap-4 w-7/8 h-7/8'>
                        <div className="flex flex-col w-3/8 gap-4 h-full">
                            <div className='flex flex-col w-full h-1/8 text-4xl text-white font-bold justify-center items-center'>
                                {recipe && recipe.title}
                                <div className="flex flex-row">
                                    {/*Custom rating component turns a long between 0 and 5.0 into a 5 start display*/}
                                    <div><Ratings rating={5} /> </div>
                                    <p className="text-lg">({100}) {recipe && recipe.category}</p>
                                </div>
                            </div>
                            <div className="relative w-full rounded-2xl overflow-hidden">
                                <img
                                    className="w-full h-full object-cover"
                                    src={
                                        recipe && recipe.image_url
                                            ? recipe.image_url
                                            : "https://img.sndimg.com/food/image/upload/f_auto,c_thumb,q_55,w_860,ar_3:2/v1/gk-static/gk/img/recipe-default-images/image-00.svg"
                                    }
                                    alt="Recipe"
                                />

                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

                                {/* Text content */}
                                <div className="absolute bottom-4 left-4 text-white">
                                    <h2 className="text-xl font-bold">{recipe && recipe.title}</h2>
                                    <p className="text-sm">{recipe && recipe.description}</p>
                                </div>
                            </div>

                            {/* ✅ BUTTONS */}
                            <div className="flex flex-row justify-center w-full h-1/8 gap-4">
                                <button
                                    onClick={loadSubmittedRecipes}
                                    className="w-1/5 h-full bg-lightGreenPC hover:bg-lightGrayPC rounded-2xl"
                                >
                                    Load
                                </button>

                                <button
                                    className="w-1/5 h-full bg-lightGreenPC hover:bg-lightGrayPC rounded-2xl"
                                    onClick={async () => {
                                        if (!recipe || !recipe.id) {
                                            alert("No recipe selected");
                                            return;
                                        }

                                        const result = await approveUserRecipe(recipe.id);

                                        if (result.success) {
                                            alert("Recipe approved and removed from user submissions!");
                                            setRecipe(null); // Clear current view
                                            // Optionally remove it from submittedRecipes list
                                            setSubmittedRecipes(prev => prev.filter(r => r.id !== recipe.id));
                                        } else {
                                            alert(result.message);
                                        }
                                    }}
                                >
                                    Approve
                                </button>



                                <button
                                    className="w-1/5 h-full bg-lightGreenPC hover:bg-lightGrayPC rounded-2xl"
                                    onClick={async () => {
                                        if (!recipe?.id) {
                                            alert("No recipe selected");
                                            return;
                                        }

                                        const result = await unsubmitUserRecipe(recipe.id);
                                        if (result.success) {
                                            alert("Recipe denied successfully");
                                            setRecipe(null); // clear current view
                                            loadSubmittedRecipes(); // refresh menu
                                        } else {
                                            alert(result.message);
                                        }
                                    }}
                                >
                                    Deny
                                </button>

                            </div>
                        </div>

                        {/* ✅ RIGHT PANEL */}
                        <div className="bg-lightGrayPC w-5/8 h-full rounded-2xl overflow-y-auto p-4">
                            <div className="flex flex-row h-full gap-4">
                                <div className="flex flex-col text-white m-5 text-2xl font-bold w-1/2 h-full">
                                    <h2 className="mb-4 text-2xl">Instructions</h2>

                                    <ol className="list-decimal list-inside space-y-3 text-2xl font-bold">
                                        {recipe?.instructions?.map((step, index) => (
                                            <li key={index} className="leading-relaxed">
                                                {step}
                                            </li>
                                        ))}
                                    </ol>
                                </div>


                                <div className="flex flex-col text-white m-5 text-2xl font-bold w-1/2 h-full">
                                    <h2 className="mb-4 text-2xl">Ingredients</h2>

                                    <ul className="list-disc list-inside space-y-3 text-2xl font-bold">
                                        {recipe?.ingredients?.map((item, index) => (
                                            <li key={index} className="leading-relaxed flex flex-row gap-2">
                                                <span className="font-semibold">{item.amount}</span>
                                                <span>{item.unit}</span>
                                                <span>{item.ingredient}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* ✅ ✅ ✅ LOAD MENU OVERLAY (MATCHES YOUR STYLE) */}
            {showLoadMenu && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-lightGrayPC w-1/3 max-h-[80%] rounded-2xl p-4 overflow-y-auto">
                        <h2 className="text-white text-2xl font-bold mb-4 text-center">
                            Select a Submitted Recipe
                        </h2>

                        {submittedRecipes.length === 0 && (
                            <p className="text-white text-center">No submitted recipes found.</p>
                        )}

                        {submittedRecipes.map((r) => (
                            <div
                                key={r.id}
                                className="bg-lightGreenPC text-white p-3 rounded-xl mb-2 cursor-pointer hover:bg-lightBluePC"
                                onClick={() => loadRecipeIntoView(r.recipe, r.id)} // <-- pass the ID here
                            >
                                <h3 className="font-bold">{r.recipe.title}</h3>
                                <p className="text-sm opacity-75">{r.recipe.category}</p>
                                <p className="text-xs text-green-300 font-bold">✅ Submitted</p>
                            </div>
                        ))}


                        <button
                            onClick={() => setShowLoadMenu(false)}
                            className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl p-2"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Admin;
