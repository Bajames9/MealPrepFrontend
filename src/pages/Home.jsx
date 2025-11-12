import { useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar.jsx";
import SearchBar from "../components/SearchBar.jsx";
import Recommendations from "../components/Recommendations.jsx";
import { useRecipeSearch } from "../hooks/useRecipeSearch.jsx";
import { useState } from "react";

/**Main Homepage for application hub A React component that allows the user to navigate through the site
 *
 * @returns {React.JSX.Element} React code for page
 * @constructor
 */

function Home() {
    // this is used to navigate to other parts of the website
    const navigate = useNavigate();

    //custom hook used to get and display search data
    const {
        search,
        setSearch,
        SearchByIngredients,
        setSearchByIngredients,
        SearchByRecipeName,
        setSearchByRecipeName,
        SearchResults,
    } = useRecipeSearch();

    // Add state for Lists filter
    const [searchByLists, setSearchByLists] = useState(false);

    //handles the load more button Navigates user to a page dedicated to search results
    const loadSearchPage = (searchTerm) => {
        // Navigate to different pages based on active filter
        if (searchByLists) {
            navigate(`/lists/search/${searchTerm}`);
        } else {
            navigate(`/search/${searchTerm}`);
        }
    };

    // Determine search mode text for badge
    const getSearchModeText = () => {
        if (SearchByIngredients) {
            return '🔍 Searching: Ingredients Only';
        } else if (SearchByRecipeName) {
            return '📖 Searching: Recipe Name Only';
        } else if (searchByLists) {
            return '📋 Searching: Public Lists';
        } else {
            return '🔍 Searching: All Fields (Name, Description, Ingredients)';
        }
    };

    // Determine badge color based on mode
    const getBadgeColor = () => {
        if (SearchByIngredients) {
            return 'bg-darkBluePC text-white';
        } else if (SearchByRecipeName) {
            return 'bg-overlayPC text-white';
        } else if (searchByLists) {
            return 'bg-lightGreenPC text-darkBluePC';
        } else {
            return 'bg-lightBluePC text-darkBluePC';
        }
    };

    // returns The React Code for this page
    return (
        <div>
            <div className="w-full h-screen">
                <div className="w-full h-full flex flex-col">
                    <SideBar className="font-black bg-darkBluePC/65 absolute z-10" />
                    <div>
                        <div className="flex flex-col justify-center items-center w-full">
                            {/* Search popup - hide when Lists filter is active */}
                            {!searchByLists && (
                                <div
                                    className="absolute rounded-2xl inset-0 m-auto w-7/8 bg-lightGreenPC drop-shadow-2xl z-5 transition-all duration-700 ease-in-out overflow-hidden"
                                    style={{
                                        height: search && search.trim() !== '' ? '105%' : '0',
                                        transform: search && search.trim() !== '' ? 'translateY(15%)' : 'translateY(100vh)',
                                        opacity: search && search.trim() !== '' ? 1 : 0,
                                    }}
                                >
                                    {search && search.trim() !== '' && (
                                        <div className="flex justify-center pt-4 pb-2">
                                            <div className={`px-6 py-2 rounded-full text-lg font-bold shadow-lg ${getBadgeColor()}`}>
                                                {getSearchModeText()}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex flex-row flex-wrap gap-4 p-4 justify-center">
                                        {SearchResults}
                                    </div>

                                    <div className="flex flex-row justify-center text-white text-2xl p-5">
                                        <button
                                            onClick={() => loadSearchPage(search)}
                                            className="w-100 h-10 bg-darkBluePC rounded-2xl hover:text-darkBluePC hover:bg-lightBluePC"
                                        >
                                            Load More
                                        </button>
                                    </div>
                                </div>
                            )}

                            <SearchBar
                                search={search}
                                setSearch={setSearch}
                                onSearchSubmit={loadSearchPage}
                                onToggleIngredients={setSearchByIngredients}
                                isIngredientsSelected={SearchByIngredients}
                                onToggleRecipeName={setSearchByRecipeName}
                                isRecipeNameSelected={SearchByRecipeName}
                                onToggleLists={setSearchByLists}
                                isListsSelected={searchByLists}
                            />
                        </div>

                        <Recommendations />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;