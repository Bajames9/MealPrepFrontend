import { useState, useEffect } from "react";
import SideBar from "../components/SideBar.jsx";
import { PlusIcon } from "@heroicons/react/24/outline";

import { whoAmI } from "../services/api.js";
import usePantry from "../hooks/usePantry.js";
import PantryList from "../components/PantryList.jsx";
import useGrocery from "../hooks/useGrocery.js";

/**
 * Pantry Management Page
 * Allows users to add, view, and remove ingredients from their pantry
 */
function Pantry() {
    const [currentUser, setCurrentUser] = useState(null);

    // Form state
    const [ingredientName, setIngredientName] = useState("");
    const [amount, setAmount] = useState("");
    const [units, setUnits] = useState("units");
    const [suggestions, setSuggestions] = useState([]);
    const [selectedIngredient, setSelectedIngredient] = useState(""); // selected from dropdown

    // Hook for pantry logic
    const {
        pantryItems,
        loading,
        message,
        messageType,
        addItem,
        removeItem
    } = usePantry(currentUser);

    const {
        groceryItems,
        groceryLoading,
        groceryMessage,
        groceryMessageType,
        groceryAddItem,
        groceryRemoveItem
    } = useGrocery(currentUser);

    // Unit options
    const unitOptions = [
        "units","cups","tablespoons","teaspoons","fluid ounces","ounces",
        "pints","quarts","gallons","milliliters","liters","grams","kilograms",
        "pounds","pieces","slices","cans","packages","bottles","drops","pinches","dash"
    ];

    // Fetch ingredient suggestions from API
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!ingredientName.trim()) {
                setSuggestions([]);
                return;
            }
            try {
                const response = await fetch(
                    `http://localhost:5000/api/pantry/search/ingredients?q=${encodeURIComponent(ingredientName)}&per_page=10`
                );

                // Ensure response is OK
                if (!response.ok) {
                    console.error("Failed to fetch:", response.status, response.statusText);
                    setSuggestions([]);
                    return;
                }

                const data = await response.json();
                if (data.success && Array.isArray(data.matches)) {
                    setSuggestions(data.matches);
                } else {
                    setSuggestions([]);
                }

                console.log("Ingredient suggestions:", data.matches); // Debug log
            } catch (err) {
                console.error("Error fetching ingredient suggestions:", err);
                setSuggestions([]);
            }
        };

        fetchSuggestions();
    }, [ingredientName]);


    // Fetch current user
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await whoAmI();
                if (response.success && response.user) {
                    setCurrentUser(response.user);
                } else {
                    setCurrentUser("guest");
                }
            } catch (err) {
                console.error("Failed to get current user:", err);
                setCurrentUser("guest");
            }
        };
        fetchCurrentUser();
    }, []);

    // Handle adding a new ingredient to Pantry
    const handleAddIngredient = async (e) => {
        e.preventDefault();
        if (!selectedIngredient || !amount || parseFloat(amount) <= 0) {
            alert("Please select an ingredient from the dropdown and enter a valid amount.");
            return;
        }

        await addItem(selectedIngredient, amount, units);
        setIngredientName("");
        setSelectedIngredient("");
        setAmount("");
        setUnits("units");
    };

    // Handle adding a new ingredient to Grocery List
    const handleAddGroceryIngredient = async (e) => {
        e.preventDefault();
        if (!selectedIngredient || !amount || parseFloat(amount) <= 0) {
            alert("Please select an ingredient from the dropdown and enter a valid amount.");
            return;
        }

        await groceryAddItem(selectedIngredient, amount, units);
        setIngredientName("");
        setSelectedIngredient("");
        setAmount("");
        setUnits("units");
    };

    const handleDownloadGroceryList = () => {
        if (!groceryItems || groceryItems.length === 0) {
            alert("Your grocery list is empty!");
            return;
        }

        // Create text content
        const textContent = groceryItems
            .map(item => `Ingredient: ${item.name}, Amount: ${item.amount}, Units: ${item.units}`)
            .join("\n");

        // Create blob and trigger download
        const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", "grocery_list.txt");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };



    // Styling classes
    const inputClass = "w-full p-3 rounded-lg bg-darkBluePC text-white text-xl border-2 border-transparent focus:outline-none focus:border-lightGreenPC";
    const buttonClass = "px-6 py-3 rounded-lg text-xl font-bold transition-colors duration-200";

    return (
        <div className="bg-lightBluePC w-full min-h-screen">
            <div className="w-full h-full flex">
                {/* Sidebar */}
                <SideBar className="font-black bg-darkBluePC/65 absolute z-10" />

                {/* Main content */}
                <div className="flex flex-col items-center w-full p-8">
                    <h1 className="font-bold text-white text-6xl mb-8">My Pantry</h1>

                    {/* Messages */}
                    {message && (
                        <div className={`w-full max-w-4xl mb-6 p-4 rounded-lg text-center text-xl font-bold ${messageType === "success"
                            ? "bg-lightGreenPC text-darkBluePC"
                            : "bg-red-400 text-white"}`}>
                            {message}
                        </div>
                    )}
                    {groceryMessage && (
                        <div className={`w-full max-w-4xl mb-6 p-4 rounded-lg text-center text-xl font-bold ${groceryMessageType === "success"
                            ? "bg-lightGreenPC text-darkBluePC"
                            : "bg-red-400 text-white"}`}>
                            {groceryMessage}
                        </div>
                    )}

                    {/* Add Ingredient Form */}
                    <div className="w-full max-w-4xl bg-darkBluePC/80 rounded-2xl shadow-2xl p-8 mb-8">
                        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
                            <PlusIcon className="w-8 h-8 mr-3" />
                            Add Ingredient
                        </h2>
                        <form onSubmit={handleAddIngredient} className="flex flex-col gap-4">

                            {/* Ingredient input with autocomplete */}
                            <div className="relative flex flex-col">
                                <label className="text-white text-lg mb-2">Ingredient Name</label>
                                <input
                                    type="text"
                                    placeholder="Start typing an ingredient..."
                                    value={ingredientName}
                                    onChange={(e) => {
                                        setIngredientName(e.target.value);
                                        setSelectedIngredient(""); // reset selection when typing
                                    }}
                                    className={inputClass}
                                    autoComplete="off"
                                />

                                {/* Dropdown suggestions */}
                                {suggestions.length > 0 && !selectedIngredient && (
                                    <ul className="absolute top-full left-0 w-full mt-1 text-white bg-darkBluePC/95 rounded-lg max-h-60 overflow-y-auto border border-lightGreenPC shadow-lg z-50">
                                        {suggestions.map((item, idx) => (
                                            <li
                                                key={idx}
                                                className="px-4 py-2 hover:bg-lightGreenPC hover:text-darkBluePC cursor-pointer"
                                                onClick={() => {
                                                    setIngredientName(item); // populate input
                                                    setSelectedIngredient(item); // mark as selected
                                                    setSuggestions([]); // hide dropdown
                                                }}
                                            >
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>


                            {/* Amount and Units */}
                            <div className="flex gap-4">
                                <div className="flex flex-col flex-1">
                                    <label className="text-white text-lg mb-2">Amount</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="e.g., 2.5"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className={inputClass}
                                    />
                                </div>

                                <div className="flex flex-col flex-1">
                                    <label className="text-white text-lg mb-2">Units</label>
                                    <select
                                        value={units}
                                        onChange={(e) => setUnits(e.target.value)}
                                        className={inputClass}
                                    >
                                        {unitOptions.map(unit => (
                                            <option key={unit} value={unit}>{unit}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Submit buttons */}
                            <div className="flex flex-row justify-center w-full gap-4">
                                <button
                                    type="submit"
                                    className={`${buttonClass} bg-lightGreenPC w-1/2 text-darkBluePC hover:bg-overlayPC hover:text-white mt-4`}
                                >
                                    Add to Pantry
                                </button>

                                <button
                                    type="button"
                                    onClick={handleAddGroceryIngredient}
                                    className={`${buttonClass} bg-lightGreenPC w-1/2 text-darkBluePC hover:bg-overlayPC hover:text-white mt-4`}
                                >
                                    Add to Grocery List
                                </button>
                                <button
                                    type="button"  // ✅ important
                                    onClick={handleDownloadGroceryList}
                                    className={`${buttonClass} bg-lightGreenPC w-1/3 text-darkBluePC hover:bg-overlayPC hover:text-white mt-4`}
                                >
                                    Download Grocery List
                                </button>



                            </div>
                        </form>
                    </div>

                    {/* Pantry and Grocery lists */}
                    <div className="flex flex-row w-full gap-4 justify-center">
                        <PantryList
                            title="Current Pantry Items"
                            items={pantryItems}
                            loading={loading}
                            onRemove={removeItem}
                        />
                        <PantryList
                            title="Grocery List"
                            items={groceryItems}
                            loading={groceryLoading}
                            onRemove={groceryRemoveItem}
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Pantry;
