import Ratings from "./Ratings.jsx";
import React, { useEffect, useState } from "react";
import {
    addUserMadeRecipe,
    deleteUserMadeRecipe,
    getAllUserSavedRecipes,
    updateUserMadeRecipe,
    submitUserRecipe,
    unsubmitUserRecipe, getUserMadeRecipes, getUserRecipeById
} from "../services/api.js";
import RecipeIngredients from "./CreateRecipeIngredients.jsx";
import RecipeInstructions from "./CreateRecipeInstructions.jsx";
import RecipeImagePicker from "./RecipeImagePicker.jsx";

let nextIdIngredient = 1;
let nextIdInstructions = 1;

function RecipeSubmissionForm() {

    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [showLoadMenu, setShowLoadMenu] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [currentRecipeId, setCurrentRecipeId] = useState(null);

    const [selectedImage, setSelectedImage] = useState(null);

    const loadSavedRecipes = async () => {
        const res = await getAllUserSavedRecipes();
        if (res.success) {
            setSavedRecipes(res.recipes);
            return res.recipes; // Still required for Load menu sync
        }
        return [];
    };

    useEffect(() => {
        loadSavedRecipes();
    }, []);

    const loadRecipeIntoForm = (recipe, id, isSubmittedFlag) => {
        setName(recipe.title);
        setCategory(recipe.category);
        setDescription(recipe.description);
        setCurrentRecipeId(id);
        setIsSubmitted(isSubmittedFlag);

        setInstructions(recipe.instructions.map((i, idx) => ({
            id: idx + 1,
            instruction: i
        })));
        setIngredient(recipe.ingredients.map((i, idx) => ({
            id: idx + 1,
            amount: i.amount,
            unit: i.unit,
            ingredient: i.ingredient
        })));

        // Load image if available
        setSelectedImage(recipe.image_url || null);
    };

    // ... (instructions and ingredient state/handlers are fine)
    const [instructions, setInstructions] = useState([
        { id: nextIdInstructions++, instruction: '' }
    ]);

    const handleAddInstructions = () => {
        setInstructions(prev => [
            ...prev,
            { id: nextIdInstructions++, instruction: "" }
        ]);
    };

    const handleDeleteInstructions = (id) => {
        setInstructions(prev => prev.filter(item => item.id !== id));
    };

    const handleUpdateInstructions = (id, field, value) => {
        setInstructions(prev =>
            prev.map(item => (item.id === id ? { ...item, [field]: value } : item))
        );
    };

    const [ingredient, setIngredient] = useState([
        { id: nextIdIngredient++, amount: '', unit: '', ingredient: '' }
    ]);

    const handleAddIngredient = () => {
        setIngredient(prev => [
            ...prev,
            { id: nextIdIngredient++, amount: "", unit: "", ingredient: "" }
        ]);
    };

    const handleDeleteIngredient = (id) => {
        setIngredient(prev => prev.filter(item => item.id !== id));
    };

    const handleUpdateIngredient = (id, field, value) => {
        setIngredient(prev =>
            prev.map(item => (item.id === id ? { ...item, [field]: value } : item))
        );
    };

    const handleNameInputChange = (event) => {
        setName(event.target.value);
    };

    const handleNewRecipe = () => {
        setName("");
        setCategory("");
        setDescription("");
        setCurrentRecipeId(null);
        setIsSubmitted(false);
        setInstructions([{ id: 1, instruction: "" }]);
        setIngredient([{ id: 1, amount: "", unit: "", ingredient: "" }]);
        setSelectedImage(null); // Reset image
    };

    // ... (image upload handlers are fine)
    const handleImageUpload = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("http://localhost:5000/api/user_recipes/upload_image", {
            method: "POST",
            body: formData
        });

        const data = await res.json();
        if (data.success) {
            setSelectedImage(`http://localhost:5000${data.url}`);
        }
        else {
            alert("Failed to upload image: " + data.message);
        }
    };


    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleImageUpload(e.target.files[0]);
        }
    };


    const handleSaveRecipe = async () => {
        // --- 1. Payload Creation (UNCHANGED) ---
        const formattedInstructions = instructions
            .map(i => i.instruction.trim())
            .filter(i => i.length > 0);

        const formattedIngredients = ingredient
            .filter(i => i.ingredient.trim() !== "")
            .map(i => ({
                amount: Number(i.amount) || 0,
                unit: i.unit,
                ingredient: i.ingredient
            }));

        const recipePayload = {
            title: name,
            category,
            description,
            instructions: formattedInstructions,
            ingredients: formattedIngredients,
            image_url: selectedImage
        };

        const isUpdate = !!currentRecipeId;

        // --- 2. API Call ---
        try {
            let response;
            const action = isUpdate ? "updated" : "added";

            // --- 2. API Call ---
            if (isUpdate) {
                response = await updateUserMadeRecipe(currentRecipeId, recipePayload);
            } else {
                // If backend does not return ID, this is where we need to compensate.
                response = await addUserMadeRecipe(recipePayload);
            }

            if (response.success) {
                alert(`✅ Recipe successfully ${action}!`);

                // --- 3. Robust Post-Save Logic ---

                // Always reload the list of saved recipes and get the new array.
                // This ensures the new recipe is in the list, even if delayed.
                const updatedRecipes = await loadSavedRecipes();

                // A. Handle NEW recipe creation (only if it was an ADD operation)
                if (!isUpdate) {
                    // CRITICAL: Assume the new recipe is the first one in the list (since you likely ORDER BY ID DESC).
                    const savedRecipeData = updatedRecipes[0];

                    if (savedRecipeData) {
                        // Load all data, which sets currentRecipeId, isSubmitted, and all form fields.
                        loadRecipeIntoForm(savedRecipeData.recipe, savedRecipeData.id, savedRecipeData.submitted);
                    } else if (response.id) {
                        // Fallback 1: If list is empty but backend *did* return an ID (even if we doubt it)
                        setCurrentRecipeId(response.id);
                        setIsSubmitted(false);
                    } else {
                        // Fallback 2: If we saved but couldn't load anything (user needs to click load)
                        console.error("Saved recipe but failed to retrieve it for form update.");
                    }
                }

                // If it was an update, loadSavedRecipes was already called above.

            } else {
                alert(`❌ Failed to ${action} recipe: ` + response.message);
            }
        } catch (err) {
            console.error("Save recipe error:", err);
            alert("❌ Network error while saving recipe");
        }
    };

    const handleNewRecipeSaved = async (newId) => {
        // 1. Ensure the ID is set immediately (critical for Update/Delete buttons)
        setCurrentRecipeId(newId);
        setIsSubmitted(false);

        // 2. Load the entire list of recipes again (updates 'savedRecipes' state)
        const updatedRecipes = await loadSavedRecipes();

        // 3. Find the specific new recipe using the ID returned from the save
        const savedRecipeData = updatedRecipes.find(r => r.id === newId);

        if (savedRecipeData) {
            // 4. Load all recipe details into the form (overwriting the current state).
            // This is the function that fully synchronizes the form.
            loadRecipeIntoForm(savedRecipeData.recipe, savedRecipeData.id, savedRecipeData.submitted);
        } else {
            console.error(`Could not find newly saved recipe with ID: ${newId} in the updated list.`);
        }
    };


    const handleDeleteRecipe = async () => {
        if (!currentRecipeId) return alert("No recipe loaded.");

        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            try {
                const response = await deleteUserMadeRecipe(currentRecipeId);
                if (response.success) {
                    alert("✅ Recipe deleted!");
                    handleNewRecipe();
                    await loadSavedRecipes();
                } else {
                    alert("❌ Failed to delete: " + response.message);
                }
            } catch (err) {
                console.error(err);
                alert("❌ Network error while deleting recipe");
            }
        }
    };

    const handleSubmitRecipe = async () => {
        if (!currentRecipeId) {
            return alert("❌ Please save the recipe before submitting.");
        }

        try {
            if (isSubmitted) {
                if (window.confirm("Revoke submission?")) {
                    const response = await unsubmitUserRecipe(currentRecipeId);
                    if (response.success) {
                        alert("✅ Submission revoked!");
                        setIsSubmitted(false);
                        await loadSavedRecipes();
                    } else {
                        alert("❌ Failed: " + response.message);
                    }
                }
                return;
            }

            if (window.confirm("Submit this recipe?")) {
                const response = await submitUserRecipe(currentRecipeId);
                if (response.success) {
                    alert("✅ Submitted!");
                    setIsSubmitted(true);
                    await loadSavedRecipes();
                } else {
                    alert("❌ Failed: " + response.message);
                }
            }
        } catch (err) {
            console.error(err);
            alert("❌ Network error while submitting recipe");
        }
    };




    return (
        <div className='flex flex-row gap-4 w-7/8 h-7/8'>
            <div className="flex flex-col w-3/8 gap-4 h-full">

                <div className='flex flex-col w-full h-1/8 text-4xl text-white font-bold justify-center items-center'>
                    <input
                        className="w-full h-50 bg-lightGreenPC m-2 rounded-2xl pl-3"
                        type="text"
                        placeholder="Name"
                        onChange={handleNameInputChange}
                        value={name}
                    />
                    <div className="flex flex-row">
                        <div><Ratings rating={5} /></div>
                        <p className="text-lg">({100})
                            <input
                                className="w-3/4 h-full bg-lightGreenPC pl-3 rounded-2xl"
                                placeholder="Category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            />
                        </p>
                    </div>
                </div>

                {/* IMAGE WITH + OVERLAY */}
                <div className="relative w-full rounded-2xl overflow-hidden h-64 border">
                    {/* Image */}
                    <img
                        className="w-full h-full object-cover"
                        src={
                            selectedImage ||
                            "https://img.sndimg.com/food/image/upload/f_auto,c_thumb,q_55,w_860,ar_3:2/v1/gk-static/gk/img/recipe-default-images/image-00.svg"
                        }
                        alt="Recipe"
                    />

                    {/* Gradient overlay, behind the button */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none"></div>

                    {/* Plus button */}
                    <label
                        className="absolute top-2 right-2 bg-white text-black rounded-full p-2 cursor-pointer hover:bg-gray-200 z-10"
                    >
                        +
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </label>

                    {/* Description */}
                    <div className="absolute bottom-4 left-4 text-white w-full">
                        <h2 className="text-xl font-bold">{name}</h2>
                        <textarea
                            className="w-17/18 bg-lightGreenPC rounded-2xl pl-3 pt-1 resize-none overflow-hidden"
                            placeholder="Description"
                            value={description}
                            rows={1}
                            onChange={(e) => setDescription(e.target.value)}
                            onInput={(e) => {
                                e.target.style.height = "auto";
                                e.target.style.height = e.target.scrollHeight + "px";
                            }}
                        />
                    </div>
                </div>

                {/* BUTTONS */}
                <div className="flex flex-row justify-center w-full h-1/8 gap-4 text-2xl font-bold">
                    <button onClick={handleNewRecipe} className="w-1/5 h-full bg-lightGreenPC hover:bg-lightGrayPC rounded-2xl">New</button>
                    <button
                        onClick={async () => {
                            await loadSavedRecipes(); // Fetch latest recipes
                            setShowLoadMenu(true);    // Then show menu
                        }}
                        className="w-1/5 h-full bg-lightGreenPC hover:bg-lightGrayPC rounded-2xl"
                    >
                        Load
                    </button>

                    <button onClick={handleSaveRecipe} className="w-1/5 h-full bg-lightGreenPC hover:bg-lightGrayPC rounded-2xl">{currentRecipeId ? "Update" : "Save"}</button>
                    <button
                        onClick={handleSubmitRecipe}
                        className={`w-1/5 h-full font-bold rounded-2xl bg-lightGreenPC hover:bg-lightGrayPC`}
                    >
                        {isSubmitted ? "Submitted" : "Submit"}
                    </button>

                    {currentRecipeId && (
                        <button
                            onClick={handleDeleteRecipe}
                            className="w-1/5 h-full bg-red-600 hover:bg-red-700 rounded-2xl"
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-lightGrayPC w-5/8 h-full rounded-2xl overflow-y-auto p-4">
                <div className=" flex flex-row h-full gap-4 ">
                    <RecipeInstructions
                        instructions={instructions}
                        addInstruction={handleAddInstructions}
                        deleteInstruction={handleDeleteInstructions}
                        updateInstruction={handleUpdateInstructions}
                    />
                    <RecipeIngredients
                        ingredients={ingredient}
                        addIngredient={handleAddIngredient}
                        deleteIngredient={handleDeleteIngredient}
                        updateIngredient={handleUpdateIngredient}
                    />
                </div>
            </div>

            {/* LOAD RECIPE OVERLAY */}
            {showLoadMenu && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-lightGrayPC w-1/3 max-h-[80%] rounded-2xl p-4 overflow-y-auto">
                        <h2 className="text-white text-2xl font-bold mb-4 text-center">Select a Saved Recipe</h2>
                        {savedRecipes.length === 0 && <p className="text-white text-center">No saved recipes found.</p>}
                        {savedRecipes.map((r) => (
                            <div
                                key={r.id}
                                className="bg-lightGreenPC text-white p-3 rounded-xl mb-2 cursor-pointer hover:bg-lightBluePC"
                                onClick={() => {
                                    loadRecipeIntoForm(r.recipe, r.id, r.submitted);
                                    setShowLoadMenu(false);
                                }}
                            >
                                <h3 className="font-bold">{r.recipe.title}</h3>
                                <p className="text-sm opacity-75">{r.recipe.category}</p>
                                {r.submitted && <p className="text-xs text-green-300 font-bold">✅ Submitted</p>}
                            </div>
                        ))}
                        <button onClick={() => setShowLoadMenu(false)} className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl p-2">Close</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default RecipeSubmissionForm;