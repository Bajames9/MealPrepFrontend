import { useState, useEffect } from "react";
import SideBar from "../components/SideBar.jsx";
import { PlusIcon, ListBulletIcon, TrashIcon } from "@heroicons/react/24/outline";
import { getAllUserLists, getList, createList, deleteList, updateList } from "../services/api.js";
import { useNavigate } from "react-router-dom";

/**
 * My Lists page - View and manage recipe lists
 * @returns {React.JSX.Element}
 * @constructor
 */
function Lists() {
    const navigate = useNavigate();
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newListTitle, setNewListTitle] = useState("");
    const [error, setError] = useState("");
    const [togglingPrivacy, setTogglingPrivacy] = useState(null);

    // Load all lists on mount
    useEffect(() => {
        loadLists();
    }, []);

    /**
     * Load all lists for the user
     */
    const loadLists = async () => {
        setLoading(true);
        try {
            const response = await getAllUserLists();
            if (response.success && response.list_ids) {
                // Fetch details for each list
                const listPromises = response.list_ids.map(id => getList(id));
                const listResponses = await Promise.all(listPromises);

                const loadedLists = listResponses
                    .filter(res => res.success && res.list)
                    .map(res => res.list);

                setLists(loadedLists);
            }
        } catch (err) {
            console.error("Failed to load lists:", err);
            setError("Failed to load lists");
        } finally {
            setLoading(false);
        }
    };

    /**
     * Create a new list
     */
    const handleCreateList = async () => {
        const trimmedTitle = newListTitle.trim();

        // Validation
        if (!trimmedTitle) {
            setError("Please enter a list name");
            return;
        }

        // Check for reserved name
        if (trimmedTitle.toLowerCase() === "favorites") {
            setError("'Favorites' is a reserved name. Please choose another.");
            return;
        }

        try {
            const response = await createList(trimmedTitle);
            if (response.success) {
                setShowCreateModal(false);
                setNewListTitle("");
                setError("");
                // Reload lists
                loadLists();
            } else {
                setError(response.message || "Failed to create list");
            }
        } catch (err) {
            console.error("Failed to create list:", err);
            setError("Failed to create list");
        }
    };

    /**
     * Delete a list
     */
    const handleDeleteList = async (listId, listTitle) => {
        // Don't allow deleting Favorites
        if (listTitle === "Favorites") {
            alert("Cannot delete the Favorites list");
            return;
        }

        const confirmed = window.confirm(`Are you sure you want to delete "${listTitle}"?`);
        if (!confirmed) return;

        try {
            const response = await deleteList(listId);
            if (response.success) {
                // Reload lists
                loadLists();
            } else {
                alert(response.message || "Failed to delete list");
            }
        } catch (err) {
            console.error("Failed to delete list:", err);
            alert("Failed to delete list");
        }
    };

    /**
     * View list details
     */
    const handleViewList = (listId) => {
        navigate(`/lists/${listId}`);
    };

    /**
     * Toggle list privacy between public and private
     */
    const handleTogglePrivacy = async (listId, currentStatus, listTitle) => {
        if (listTitle === "Favorites") {
            alert("Cannot change privacy of Favorites list");
            return;
        }

        setTogglingPrivacy(listId);
        try {
            const response = await updateList(listId, { public: !currentStatus });
            if (response.success) {
                // Reload lists to show updated status
                loadLists();
            } else {
                alert("Failed to update privacy setting");
            }
        } catch (err) {
            console.error("Failed to toggle privacy:", err);
            alert("Failed to update privacy setting");
        } finally {
            setTogglingPrivacy(null);
        }
    };

    return (
        <div className="bg-lightBluePC w-full min-h-screen">
            <div className="w-full h-full flex">
                {/* Sidebar for navigation */}
                <SideBar className="font-black bg-darkBluePC/65 absolute z-10" />

                {/* Main content area */}
                <div className="flex flex-col items-center w-full p-8">
                    {/* Page Title */}
                    <div className="flex items-center justify-between w-full max-w-6xl mb-8">
                        <div className="flex items-center gap-4">
                            <ListBulletIcon className="w-16 h-16 text-white" />
                            <h1 className="font-bold text-white text-6xl">My Lists</h1>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-lightGreenPC text-darkBluePC text-2xl font-bold rounded-lg hover:bg-overlayPC hover:text-white transition-colors"
                        >
                            <PlusIcon className="w-6 h-6" />
                            New List
                        </button>
                    </div>

                    {/* Loading State */}
                    {loading ? (
                        <div className="text-white text-3xl mt-20">Loading lists...</div>
                    ) : lists.length === 0 ? (
                        /* Empty State */
                        <div className="flex flex-col items-center justify-center mt-20">
                            <ListBulletIcon className="w-32 h-32 text-lightGrayPC mb-4" />
                            <p className="text-white text-3xl text-center">No lists yet!</p>
                            <p className="text-lightGreenPC text-xl text-center mt-2">
                                Create a list to organize your recipes
                            </p>
                        </div>
                    ) : (
                        /* Lists Grid */
                        <div className="w-full max-w-6xl">
                            <p className="text-lightGreenPC text-2xl mb-6">
                                {lists.length} {lists.length === 1 ? 'list' : 'lists'}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {lists.map((list) => (
                                    <div
                                        key={list.list_id}
                                        className="bg-darkBluePC/80 rounded-xl p-6 shadow-xl hover:bg-overlayPC transition-colors"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <h3 className="text-white text-2xl font-bold flex-1">
                                                {list.title}
                                            </h3>
                                            {list.title !== "Favorites" && (
                                                <button
                                                    onClick={() => handleDeleteList(list.list_id, list.title)}
                                                    className="text-red-400 hover:text-red-600"
                                                >
                                                    <TrashIcon className="w-6 h-6" />
                                                </button>
                                            )}
                                        </div>

                                        <p className="text-lightGreenPC text-lg mb-4">
                                            {list.recipe_ids?.length || 0} recipes
                                        </p>

                                        {/* Privacy Toggle */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-white text-sm">Privacy:</span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleTogglePrivacy(list.list_id, list.public, list.title);
                                                    }}
                                                    disabled={togglingPrivacy === list.list_id || list.title === "Favorites"}
                                                    className={`px-3 py-1 rounded-lg text-sm font-bold transition-colors ${list.public
                                                            ? 'bg-lightGreenPC text-darkBluePC hover:bg-lightGreenPC/80'
                                                            : 'bg-gray-600 text-white hover:bg-gray-700'
                                                        } ${togglingPrivacy === list.list_id ? 'opacity-50 cursor-wait' : ''} ${list.title === "Favorites" ? 'cursor-not-allowed opacity-50' : ''
                                                        }`}
                                                >
                                                    {togglingPrivacy === list.list_id ? 'Updating...' : (list.public ? 'Public' : 'Private')}
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleViewList(list.list_id)}
                                            className="w-full py-2 bg-lightGreenPC text-darkBluePC font-bold rounded-lg hover:bg-lightBluePC/80 transition-colors"
                                        >
                                            View List
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Create List Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-lightGreenPC rounded-2xl p-8 w-full max-w-md">
                        <h2 className="text-darkBluePC text-3xl font-bold mb-6">Create New List</h2>

                        {error && (
                            <div className="bg-red-400 text-white p-3 rounded-lg mb-4">
                                {error}
                            </div>
                        )}

                        <input
                            type="text"
                            placeholder="List name (e.g., Weeknight Dinners)"
                            value={newListTitle}
                            onChange={(e) => setNewListTitle(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleCreateList();
                            }}
                            className="w-full p-3 rounded-lg bg-darkBluePC text-white text-xl mb-6"
                            autoFocus
                        />

                        <div className="flex gap-4">
                            <button
                                onClick={handleCreateList}
                                className="flex-1 py-3 bg-darkBluePC text-white font-bold rounded-lg hover:bg-overlayPC"
                            >
                                Create
                            </button>
                            <button
                                onClick={() => {
                                    setShowCreateModal(false);
                                    setNewListTitle("");
                                    setError("");
                                }}
                                className="flex-1 py-3 bg-lightGrayPC text-white font-bold rounded-lg hover:bg-overlayPC"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Lists;