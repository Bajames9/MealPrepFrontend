import { useState, useEffect } from "react";
import SideBar from "../components/SideBar.jsx";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { getPantryItems, updatePantryItems, whoAmI } from "../services/api.js";

/**
 * Pantry Management Page
 * Allows users to add, view, and remove ingredients from their pantry
 * @returns {React.JSX.Element}
 * @constructor
 */
function Pantry() {
    const [currentUser, setCurrentUser] = useState(null);

    const invalidateRecommendationsCache = () => {
        if (!currentUser) return;

        // Use user-specific cache key
        const pantryTimeKey = `${currentUser}_pantry_last_updated`;
        sessionStorage.setItem(pantryTimeKey, Date.now().toString());
        console.log(`Pantry updated for ${currentUser} - recommendations cache invalidated`);
    };

    // State for the add ingredient form
    const [ingredientName, setIngredientName] = useState("");
    const [amount, setAmount] = useState("");
    const [units, setUnits] = useState("units");

    // State for pantry items list
    const [pantryItems, setPantryItems] = useState([]);

    // State for error/success messages
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // "success" or "error"

    // Common unit options
    const unitOptions = [
        "units",
        "cups",
        "tablespoons",
        "teaspoons",
        "fluid ounces",
        "ounces",
        "pints",
        "quarts",
        "gallons",
        "milliliters",
        "liters",
        "grams",
        "kilograms",
        "pounds",
        "pieces",
        "slices",
        "cans",
        "packages",
        "bottles",
        "drops",
        "pinches",
        "dash"
    ];

    // Get current user on mount
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await whoAmI();
                if (response.success && response.user) {
                    setCurrentUser(response.user);
                } else {
                    setCurrentUser('guest');
                }
            } catch (err) {
                console.error("Failed to get current user:", err);
                setCurrentUser('guest');
            }
        };

        fetchCurrentUser();
    }, []);

    // Load pantry items when user is known
    useEffect(() => {
        if (currentUser) {
            loadPantryItems();
        }
    }, [currentUser]);

    /**
     * Load pantry items from API
     */
    const loadPantryItems = async () => {
        try {
            const response = await getPantryItems();
            if (response.success) {
                setPantryItems(response.items || []);
            } else {
                showMessage(response.message || "Failed to load pantry items", "error");
            }
        } catch (err) {
            console.error("Failed to load pantry items:", err);
            showMessage("Failed to load pantry items", "error");
        }
    };

    /**
     * Handle adding a new ingredient to the pantry
     */
    const handleAddIngredient = async (e) => {
        e.preventDefault();

        // Validation
        if (!ingredientName.trim()) {
            showMessage("Please enter an ingredient name", "error");
            return;
        }

        if (!amount || parseFloat(amount) <= 0) {
            showMessage("Please enter a valid amount", "error");
            return;
        }

        try {
            // Bailey's format: send array of items
            const response = await updatePantryItems([
                {
                    name: ingredientName.trim(),
                    amount: parseFloat(amount),
                    units: units
                }
            ]);

            if (response.success) {
                showMessage("Ingredient added successfully!", "success");
                clearForm();
                invalidateRecommendationsCache();
                // Reload to get updated list
                loadPantryItems();
            } else {
                showMessage(response.message || "Failed to add ingredient", "error");
            }

        } catch (err) {
            console.error("Failed to add ingredient:", err);
            showMessage("Failed to add ingredient", "error");
        }
    };

    /**
     * Handle removing an ingredient from the pantry
     * Bailey's API: Set amount to 0 to remove
     */
    const handleRemoveIngredient = async (itemName) => {
        const confirmed = window.confirm("Are you sure you want to remove this ingredient?");
        if (!confirmed) return;

        try {
            // send item with amount: 0 to delete
            const response = await updatePantryItems([
                {
                    name: itemName,
                    amount: 0,
                    units: "" // doesn't matter for deletion
                }
            ]);

            if (response.success) {
                showMessage("Ingredient removed successfully!", "success");
                invalidateRecommendationsCache();
                // Reload to get updated list
                loadPantryItems();
            } else {
                showMessage(response.message || "Failed to remove ingredient", "error");
            }

        } catch (err) {
            console.error("Failed to remove ingredient:", err);
            showMessage("Failed to remove ingredient", "error");
        }
    };

    /**
     * Clear the add ingredient form
     */
    const clearForm = () => {
        setIngredientName("");
        setAmount("");
        setUnits("units");
    };

    /**
     * Show a temporary message to the user
     */
    const showMessage = (msg, type) => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => {
            setMessage("");
            setMessageType("");
        }, 3000);
    };

    // Styling classes
    const inputClass = "w-full p-3 rounded-lg bg-darkBluePC text-white text-xl border-2 border-transparent focus:outline-none focus:border-lightGreenPC";
    const buttonClass = "px-6 py-3 rounded-lg text-xl font-bold transition-colors duration-200";

    return (
        <div className="bg-lightBluePC w-full min-h-screen">
            <div className="w-full h-full flex">
                {/* Sidebar for navigation */}
                <SideBar className="font-black bg-darkBluePC/65 absolute z-10" />

                {/* Main content area */}
                <div className="flex flex-col items-center w-full p-8">
                    {/* Page Title */}
                    <h1 className="font-bold text-white text-6xl mb-8">My Pantry</h1>

                    {/* Message Display */}
                    {message && (
                        <div className={`w-full max-w-4xl mb-6 p-4 rounded-lg text-center text-xl font-bold ${messageType === "success"
                            ? "bg-lightGreenPC text-darkBluePC"
                            : "bg-red-400 text-white"
                            }`}>
                            {message}
                        </div>
                    )}

                    {/* Add Ingredient Form */}
                    <div className="w-full max-w-4xl bg-darkBluePC/80 rounded-2xl shadow-2xl p-8 mb-8">
                        <h2 className="text-white text-3xl font-bold mb-6 flex items-center">
                            <PlusIcon className="w-8 h-8 mr-3" />
                            Add Ingredient
                        </h2>
                        <form onSubmit={handleAddIngredient} className="flex flex-col gap-4">
                            <div className="flex flex-col">
                                <label className="text-white text-lg mb-2">Ingredient Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Chicken Breast, Tomatoes, Olive Oil"
                                    value={ingredientName}
                                    onChange={(e) => setIngredientName(e.target.value)}
                                    className={inputClass}
                                />
                            </div>

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
                                        {unitOptions.map((unitOption) => (
                                            <option key={unitOption} value={unitOption}>
                                                {unitOption}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className={`${buttonClass} bg-lightGreenPC text-darkBluePC hover:bg-overlayPC hover:text-white mt-4`}
                            >
                                Add to Pantry
                            </button>
                        </form>
                    </div>

                    {/* Pantry Items List */}
                    <div className="w-full max-w-4xl bg-darkBluePC/80 rounded-2xl shadow-2xl p-8">
                        <h2 className="text-white text-3xl font-bold mb-6">Current Pantry Items</h2>

                        {pantryItems.length === 0 ? (
                            <p className="text-white text-xl text-center py-8">
                                Your pantry is empty. Add some ingredients to get started!
                            </p>
                        ) : (
                            <div className="grid gap-4">
                                {pantryItems.map((item, index) => (
                                    <div
                                        key={`${item.name}-${index}`}
                                        className="bg-lightBluePC rounded-lg p-4 flex items-center justify-between hover:bg-overlayPC transition-colors duration-200"
                                    >
                                        <div className="flex-1">
                                            <h3 className="text-white text-2xl font-bold">{item.name}</h3>
                                            <p className="text-lightGreenPC text-lg">
                                                {item.amount} {item.units}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveIngredient(item.name)}
                                            className={`${buttonClass} bg-red-500 text-white hover:bg-red-600 flex items-center gap-2`}
                                        >
                                            <TrashIcon className="w-6 h-6" />
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Pantry;