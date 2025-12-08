import React, { useState, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { getAllUserLists, getList, updateList, createList } from "../services/api.js";

export default function AddToListModal({ recipeId, onClose }) {
    const [userLists, setUserLists] = useState([]);
    const [loadingLists, setLoadingLists] = useState(false);
    const [addingToList, setAddingToList] = useState(null);

    const [showCreateInModal, setShowCreateInModal] = useState(false);
    const [newListTitle, setNewListTitle] = useState("");
    const [createError, setCreateError] = useState("");

    // Load user lists when modal opens
    useEffect(() => {
        const loadLists = async () => {
            setLoadingLists(true);
            try {
                const response = await getAllUserLists();
                if (response.success && response.list_ids) {
                    const listPromises = response.list_ids.map(id => getList(id));
                    const listResponses = await Promise.all(listPromises);

                    const lists = listResponses
                        .filter(res => res.success && res.list && res.list.title !== "Favorites")
                        .map(res => res.list);

                    setUserLists(lists);
                }
            } catch (err) {
                console.error("Failed to load lists:", err);
            } finally {
                setLoadingLists(false);
            }
        };

        loadLists();
    }, []);

    // Add recipe to an existing list
    const handleAddToList = async (listId, listTitle) => {
        setAddingToList(listId);
        try {
            const response = await updateList(listId, { recipe_ids: [parseInt(recipeId)] });
            if (response.success) {
                alert(`Added to "${listTitle}"!`);
                onClose();
            } else {
                alert("Failed to add to list");
            }
        } catch (err) {
            console.error("Failed to add to list:", err);
            alert("Failed to add to list");
        } finally {
            setAddingToList(null);
        }
    };

    // Create a new list and add recipe
    const handleCreateAndAdd = async () => {
        const trimmedTitle = newListTitle.trim();

        if (!trimmedTitle) {
            setCreateError("Please enter a list name");
            return;
        }

        if (trimmedTitle.toLowerCase() === "favorites") {
            setCreateError("'Favorites' is a reserved name. Please choose another.");
            return;
        }

        setAddingToList("creating");
        try {
            const response = await createList(trimmedTitle, [parseInt(recipeId)]);
            if (response.success) {
                alert(`Created "${trimmedTitle}" and added recipe!`);
                onClose();
            } else {
                setCreateError(response.message || "Failed to create list");
            }
        } catch (err) {
            console.error("Failed to create list:", err);
            setCreateError("Failed to create list");
        } finally {
            setAddingToList(null);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-lightGreenPC rounded-2xl p-8 w-full max-w-md max-h-[80vh] overflow-y-auto">
                <h2 className="text-darkBluePC text-3xl font-bold mb-6">Add to List</h2>

                {loadingLists ? (
                    <p className="text-darkBluePC text-xl">Loading lists...</p>
                ) : showCreateInModal ? (
                    <div>
                        <h3 className="text-darkBluePC text-xl font-bold mb-4">Create New List</h3>
                        {createError && (
                            <div className="bg-red-400 text-white p-3 rounded-lg mb-4 text-sm">
                                {createError}
                            </div>
                        )}
                        <input
                            type="text"
                            placeholder="List name (e.g., Weeknight Dinners)"
                            value={newListTitle}
                            onChange={(e) => setNewListTitle(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleCreateAndAdd();
                            }}
                            className="w-full p-3 rounded-lg bg-darkBluePC text-white text-lg mb-4"
                            autoFocus
                        />

                        <div className="space-y-2">
                            <button
                                onClick={handleCreateAndAdd}
                                disabled={addingToList === "creating"}
                                className="w-full py-3 bg-darkBluePC text-white font-bold rounded-lg hover:bg-overlayPC disabled:opacity-50"
                            >
                                {addingToList === "creating" ? "Creating..." : "Create & Add Recipe"}
                            </button>
                            <button
                                onClick={() => setShowCreateInModal(false)}
                                className="w-full py-3 bg-lightGrayPC text-white font-bold rounded-lg hover:bg-overlayPC"
                            >
                                Back to Lists
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <button
                            onClick={() => setShowCreateInModal(true)}
                            className="w-full p-4 bg-lightGreenPC border-2 border-darkBluePC text-darkBluePC text-xl font-bold rounded-lg hover:bg-darkBluePC hover:text-white transition-colors flex items-center justify-center gap-2"
                        >
                            <PlusIcon className="w-6 h-6" />
                            Create New List
                        </button>

                        {userLists.length > 0 && (
                            <>
                                <div className="text-darkBluePC text-center py-2">or add to existing:</div>
                                {userLists.map((list) => (
                                    <button
                                        key={list.list_id}
                                        onClick={() => handleAddToList(list.list_id, list.title)}
                                        disabled={addingToList === list.list_id}
                                        className="w-full p-4 bg-darkBluePC text-white text-xl font-bold rounded-lg hover:bg-overlayPC transition-colors disabled:opacity-50 disabled:cursor-wait text-left"
                                    >
                                        {list.title}
                                        <span className="text-sm text-lightGreenPC block mt-1">
                      {list.recipe_ids?.length || 0} recipes
                    </span>
                                    </button>
                                ))}
                            </>
                        )}

                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-lightGrayPC text-white font-bold rounded-lg hover:bg-overlayPC mt-4"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
