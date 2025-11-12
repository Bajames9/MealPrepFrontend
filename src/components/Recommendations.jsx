import ScrollPane from "./ScrollPane.jsx";
import { useHomeData } from "../hooks/getRecomendations.js";

/**
 * Gets and Creates Lists for recommendations favorites and 5 random categories
 * Shows loading skeleton while recommendations are fetching
 * @returns {React.JSX.Element}
 * @constructor
 */
function Recommendations() {
    // hook used to get list of cards for each Thing being displayed
    const {
        recommendationCards,
        recommendationsLoading,
        favoriteCards,
        category1Cards,
        category1Name,
        category2Cards,
        category2Name,
        category3Cards,
        category3Name,
        category4Cards,
        category4Name,
        category5Cards,
        category5Name,
    } = useHomeData();

    //React Code Returns and Displays Each card list if it is not Empty
    return (
        <div className="flex flex-col w-full h-full bg-lightBluePC " >
            {/* Use the variables returned from the hook */}
            {favoriteCards && (
                <ScrollPane title="Favorites">
                    {favoriteCards}
                </ScrollPane>
            )}

            {/* Recommendations with loading state */}
            {recommendationsLoading ? (
                <div className="w-full px-8 py-6">
                    <h2 className="text-white text-4xl font-bold mb-4">Recommendations</h2>
                    <div className="flex gap-6 overflow-hidden">
                        {/* Loading skeleton cards */}
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="h-75 w-100 bg-darkBluePC/50 rounded-2xl animate-pulse flex-shrink-0"
                            >
                                <div className="h-full w-8/10 bg-gray-600/30 rounded-l-2xl"></div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : recommendationCards ? (
                <ScrollPane title="Recommendations">
                    {recommendationCards}
                </ScrollPane>
            ) : null}

            {category1Cards && category1Name && (
                <ScrollPane title={category1Name}>
                    {category1Cards}
                </ScrollPane>
            )}
            {category2Cards && category2Name && (
                <ScrollPane title={category2Name}>
                    {category2Cards}
                </ScrollPane>
            )}
            {category3Cards && category3Name && (
                <ScrollPane title={category3Name}>
                    {category3Cards}
                </ScrollPane>
            )}
            {category4Cards && category4Name && (
                <ScrollPane title={category4Name}>
                    {category4Cards}
                </ScrollPane>
            )}
            {category5Cards && category5Name && (
                <ScrollPane title={category5Name}>
                    {category5Cards}
                </ScrollPane>
            )}
        </div>
    )
}
export default Recommendations