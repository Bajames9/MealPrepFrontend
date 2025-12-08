import { useState, useEffect } from "react";
import { getGroceryItems, updateGroceryItems } from "../services/api.js";

export default function useGrocery(currentUser) {
    // State is intentionally named generically here, as the return
    // object will handle the specific naming convention (e.g., 'groceryLoading')
    const [items, setItems] = useState([]);
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

    const loadGroceryItems = async () => {
        setLoading(true);
        try {
            const res = await getGroceryItems();
            if (res.success) {
                setItems(res.items || []);
            } else {
                showMessage(res.message || "Failed to load grocery list", "error");
            }
        } catch (err) {
            console.error("Failed to load grocery list:", err);
            showMessage("Failed to load grocery list", "error");
        }
        setLoading(false);
    };

    // Function to add an item
    const addItem = async (name, amount, units) => {
        try {
            const res = await updateGroceryItems([
                { name, amount, units }
            ]);

            if (res.success) {
                showMessage("Ingredient added to grocery list", "success");
                loadGroceryItems();
            } else {
                showMessage(res.message || "Failed to add ingredient", "error");
            }
        } catch (err) {
            console.error("Add failed:", err);
            showMessage("Failed to add ingredient", "error");
        }
    };

    const removeItem = async (itemName) => {
        const confirmed = window.confirm("Remove this ingredient?");
        if (!confirmed) return;

        try {
            const res = await updateGroceryItems([
                { name: itemName, amount: 0, units: "" }
            ]);

            if (res.success) {
                showMessage("Ingredient removed", "success");
                loadGroceryItems();
            } else {
                showMessage(res.message || "Failed to remove ingredient", "error");
            }
        } catch (err) {
            console.error("Remove failed:", err);
            showMessage("Failed to remove ingredient", "error");
        }
    };

    useEffect(() => {
        if (currentUser && currentUser !== "guest") loadGroceryItems();
    }, [currentUser]);

    return {
        // ⭐ MATCHING THE NAMES used in Pantry.jsx exactly
        groceryItems: items,
        groceryLoading: loading,
        groceryMessage: message,
        groceryMessageType: messageType,
        groceryAddItem: addItem,
        groceryRemoveItem: removeItem,
        reload: loadGroceryItems
    };
}