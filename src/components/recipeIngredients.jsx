import { useEffect, useState } from "react";
import {getGroceryItems, getPantryItems, updateGroceryItems} from "../services/api.js";

function RecipeIngredients({ recipe }) {
    const [pantryItems, setPantryItems] = useState([]);
    const [groceryItems, setGroceryItems] = useState([]);

    const [groceryList, setGroceryList] = useState([]);




    const addToGroceryList = async (text, name, amount, units) => {


        try {
            const res = await updateGroceryItems([
                { name, amount, units }
            ]);

            if (res.success) {
                setGroceryList(prev => [...prev, text]);
            }
        } catch (err) {
            console.error("Add failed:", err);
        }


    };

    const removeFromGroceryList = async (text, itemName) => {


        try {
            const res = await updateGroceryItems([
                { name: itemName, amount: 0, units: "" }
            ]);
            if (res.success) {
                setGroceryList(prev => prev.filter(item => item !== text));
            }
        } catch (err) {
            console.error("Remove failed:", err);

        }



    };




    const loadPantryItems = async () => {
        try {
            const response = await getPantryItems();
            if (response.success) {
                setPantryItems(response.items || []);
            } else {
                console.log(response.message || "Failed to load pantry items", "error");
            }
        } catch (err) {
            console.error("Failed to load pantry items:", err);
            console.log("Failed to load pantry items", "error");
        }
    };

    const loadGroceryItems = async () => {
        try {
            const response = await getGroceryItems();
            if (response.success) {
                setGroceryItems(response.items || []);
            } else {
                console.log(response.message || "Failed to load grocery items", "error");
            }
        } catch (err) {
            console.error("Failed to load grocery items:", err);
            console.log("Failed to load grocery items", "error");
        }
    };


    useEffect(() => {
        loadPantryItems();
        loadGroceryItems()
    }, []);

    useEffect(() => {
        console.log(pantryItems);
    }, [pantryItems]);

    function formatIngredients(recipe) {
        if (!recipe || !recipe.ingredients || !recipe.quantities || !recipe.ingredientsParts) return [];

        let items = [];

        try {
            const ingredientsArr = JSON.parse(recipe.ingredients);
            const quantitiesArr = JSON.parse(recipe.quantities);
            const partsArr = recipe.ingredientsParts.split(",").map(p => p.trim());

            let templateIndex = 0;

            for (let i = 0; i < ingredientsArr.length; i++) {
                const quantity = quantitiesArr[i] ? quantitiesArr[i].trim() : "";
                let ingredient = ingredientsArr[i] ? ingredientsArr[i].trim() : "";



                // detect template usage
                const usesTemplate = ingredient.includes("$template1$");
                let part = "";

                if (usesTemplate && partsArr[templateIndex]) {
                    part = partsArr[templateIndex].trim();
                    ingredient = ingredient.replace(/\$template1\$/g, part);
                    templateIndex++; // only move to next part when used
                }

                console.log(`${quantity}:${ingredient}:${part}`)
                const text = `${quantity} ${ingredient}`.trim();

                if (text) {
                    const partLower = part.toLowerCase();
                    const existsInPantry = pantryItems.some(item =>
                        partLower.includes(item?.name?.toLowerCase() || "")
                    );

                    const isInGroceryList = groceryItems.some(
                        (item) => item.name.toLowerCase() === (part || ingredient).toLowerCase()
                    );

                    // Split quantity: e.g., "2 cups" → ["2", "cups"]




                    items.push(
                        <li key={i} className="mb-1 flex gap-2">
                            <button className="flex flex-row gap-4 w-full h-full items-start p-4 rounded-2xl bg-lightGreenPC">
                                <input
                                    type="checkbox"
                                    checked={existsInPantry || isInGroceryList}
                                    disabled={existsInPantry}   // pantry items locked
                                    onChange={() => {
                                        if (existsInPantry) return;

                                        const itemName = part; // name in DB comes from part

                                        if (isInGroceryList) {
                                            removeFromGroceryList(text, itemName);
                                            // remove locally for instant UI update
                                            setGroceryItems(prev => prev.filter(item => item.name.toLowerCase() !== itemName.toLowerCase()));
                                        } else {
                                            const amount = quantity; // amount in DB comes from quantity string
                                            const units = ingredient.split(" ")[0]; // units in DB comes from first word of ingredient

                                            addToGroceryList(text, itemName, amount, units);
                                            // add locally for instant UI update
                                            setGroceryItems(prev => [...prev, { name: itemName, amount, units }]);
                                        }
                                    }}
                                    className={`w-4 h-4 
                                        ${existsInPantry ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
                                    `}
                                />


                                <span>{text}</span>
                            </button>
                        </li>
                    );
                }
            }


        } catch (err) {
            console.error("Error formatting ingredients:", err);
        }

        return items;
    }



    const ingredientsList = formatIngredients(recipe);

    return (
        <div>
            <label>Ingredients</label>
            {ingredientsList.length > 0 ? (
                <ul className="list-disc list-inside">{ingredientsList}</ul>
            ) : (
                "No ingredients available."
            )}
        </div>
    );
}

export default RecipeIngredients;
