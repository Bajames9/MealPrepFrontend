import { useParams, useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar.jsx";
import SearchBar from "../components/SearchBar.jsx";
import ListCard from "../components/ListCard.jsx";
import { useState, useEffect, useCallback } from "react";
import { searchPublicLists, copyPublicList } from "../services/api.js";

/**
 * Page for searching and viewing public recipe lists
 * Shows lists that match the search term in their title
 */
function PublicListsSearchPage() {
    const { term: urlTerm } = useParams();
    const navigate = useNavigate();

    const [search, setSearch] = useState(urlTerm || "");
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [copyingListId, setCopyingListId] = useState(null);

    // Search for lists when search term changes
    useEffect(() => {
        const searchTerm = search.trim();
        if (searchTerm === "") {
            setLists([]);
            return;
        }

        const controller = new AbortController();

        const fetchLists = async () => {
            setLoading(true);
            try {
                const response = await searchPublicLists(searchTerm, currentPage, 20, controller.signal);

                if (response.success && response.lists) {
                    if (currentPage === 1) {
                        setLists(response.lists);
                    } else {
                        setLists(prev => [...prev, ...response.lists]);
                    }
                    setHasMore(response.lists.length === 20);
                } else {
                    if (currentPage === 1) {
                        setLists([]);
                    }
                    setHasMore(false);
                }
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error("Search lists failed:", err);
                }
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(fetchLists, 300);

        return () => {
            controller.abort();
            clearTimeout(debounceTimer);
        };
    }, [search, currentPage]);

    // Reset page when search term changes
    useEffect(() => {
        setCurrentPage(1);
        setLists([]);
        setHasMore(true);
    }, [search]);

    const handleScroll = useCallback((e) => {
        const target = e.target;
        if (loading || !hasMore) return;

        if (target.scrollHeight - target.scrollTop <= target.clientHeight + 1) {
            setCurrentPage(prev => prev + 1);
        }
    }, [loading, hasMore]);

    const handleCopyList = async (listId, listTitle) => {
        setCopyingListId(listId);
        try {
            const response = await copyPublicList(listId, `Copy of ${listTitle}`);
            if (response.success) {
                alert(`"${listTitle}" has been added to your lists!`);
            } else {
                alert("Failed to copy list: " + (response.message || "Unknown error"));
            }
        } catch (err) {
            console.error("Failed to copy list:", err);
            alert("Failed to copy list");
        } finally {
            setCopyingListId(null);
        }
    };

    return (
        <div className="bg-lightBluePC w-full h-screen">
            <div className="w-full h-full flex flex-col">
                <SideBar className="font-black bg-darkBluePC/65 absolute z-10" />

                {/* Search bar */}
                <div className="flex flex-col gap-4 justify-center items-center w-full mt-10">
                    <SearchBar
                        search={search}
                        setSearch={setSearch}
                        onSearchSubmit={(term) => setSearch(term)}
                        onToggleIngredients={() => { }}
                        isIngredientsSelected={false}
                        onToggleRecipeName={() => { }}
                        isRecipeNameSelected={false}
                        onToggleLists={() => { }}
                        isListsSelected={true}
                    />

                    {/* Search mode indicator */}
                    {search && search.trim() !== '' && (
                        <div className="px-6 py-3 rounded-full text-xl font-bold shadow-lg bg-lightGreenPC text-darkBluePC">
                            📋 Searching: Public Lists
                        </div>
                    )}
                </div>

                {/* Results */}
                <div
                    className="flex-1 overflow-y-auto p-8"
                    onScroll={handleScroll}
                >
                    {search.trim() === "" ? (
                        <div className="flex flex-col items-center justify-center mt-20">
                            <p className="text-white text-3xl text-center">
                                Search for public recipe lists
                            </p>
                            <p className="text-lightGreenPC text-xl text-center mt-2">
                                Try searching for "dinner", "holiday", "healthy", etc.
                            </p>
                        </div>
                    ) : lists.length === 0 && !loading ? (
                        <div className="flex flex-col items-center justify-center mt-20">
                            <p className="text-white text-3xl text-center">
                                No public lists found for "{search}"
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="max-w-6xl mx-auto">
                                <p className="text-lightGreenPC text-2xl mb-6">
                                    {lists.length} {lists.length === 1 ? 'list' : 'lists'} found
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {lists.map((list) => (
                                        <ListCard
                                            key={list.list_id}
                                            listId={list.list_id}
                                            title={list.title}
                                            recipeCount={(() => {
                                                // Handle recipe_ids as either array or JSON string
                                                if (Array.isArray(list.recipe_ids)) {
                                                    return list.recipe_ids.length;
                                                }
                                                if (typeof list.recipe_ids === 'string') {
                                                    try {
                                                        const parsed = JSON.parse(list.recipe_ids);
                                                        return Array.isArray(parsed) ? parsed.length : 0;
                                                    } catch {
                                                        return 0;
                                                    }
                                                }
                                                return 0;
                                            })()}
                                            isPublic={list.public}
                                            onCopyList={copyingListId === list.list_id ? null : handleCopyList}
                                        />
                                    ))}
                                </div>
                            </div>

                            {loading && (
                                <div className="w-full text-center p-4 text-white text-2xl">
                                    Loading more lists...
                                </div>
                            )}

                            {!hasMore && lists.length > 0 && (
                                <div className="w-full text-center p-4 text-gray-400">
                                    You've reached the end of the results.
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PublicListsSearchPage;