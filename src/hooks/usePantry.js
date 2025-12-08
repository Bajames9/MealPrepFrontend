import { useState, useEffect } from "react";
import { getPantryItems, updatePantryItems } from "../services/api.js";

export default function usePantry(currentUser) {
    const [pantryItems, setPantryItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const showMessage = (msg, type) => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => {
            setMessage("");
            setMessageType("");
        }, 3000);
    };

    const invalidateRecommendationsCache = () => {
        if (!currentUser) return;
        const pantryTimeKey = `${currentUser}_pantry_last_updated`;
        sessionStorage.setItem(pantryTimeKey, Date.now().toString());
    };

    const loadPantryItems = async () => {
        setLoading(true);
        try {
            const res = await getPantryItems();
            if (res.success) {
                setPantryItems(res.items || []);
            } else {
                showMessage(res.message || "Failed to load pantry items", "error");
            }
        } catch (err) {
            console.error("Failed to load pantry:", err);
            showMessage("Failed to load pantry items", "error");
        }
        setLoading(false);
    };

    // ⭐ NEW: Function to add an item to the pantry
    const addItem = async (name, amount, units) => {
        try {
            const res = await updatePantryItems([{ name, amount, units }]);
            if (res.success) {
                showMessage("Ingredient added to pantry", "success");
                loadPantryItems();
            } else {
                showMessage(res.message || "Failed to add ingredient", "error");
            }
        } catch (err) {
            console.error(err);
            showMessage("Failed to add ingredient", "error");
        }
    };

    const removeItem = async (itemName) => {
        const confirmed = window.confirm("Remove this ingredient?");
        if (!confirmed) return;
        try {
            const res = await updatePantryItems([{ name: itemName, amount: 0, units: "" }]);
            if (res.success) {
                showMessage("Ingredient removed", "success");
                loadPantryItems();
            } else {
                showMessage(res.message || "Failed to remove ingredient", "error");
            }
        } catch (err) {
            console.error(err);
            showMessage("Failed to remove ingredient", "error");
        }
    };

    useEffect(() => {
        if (currentUser) loadPantryItems();
    }, [currentUser]);

    return { pantryItems, loading, addItem, removeItem, reload: loadPantryItems };
}