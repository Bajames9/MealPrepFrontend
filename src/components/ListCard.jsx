import { ListBulletIcon, PlusIcon, LockClosedIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

/**
 * Card component for displaying list information
 * Used in public lists search results
 */
function ListCard({ listId, title, recipeCount, isPublic, onCopyList }) {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/lists/${listId}`);
    };

    const handleCopyClick = (e) => {
        e.stopPropagation();
        if (onCopyList) {
            onCopyList(listId, title);
        }
    };

    return (
        <div
            onClick={handleCardClick}
            className="bg-darkBluePC/80 rounded-xl p-6 shadow-xl hover:bg-overlayPC transition-colors cursor-pointer relative"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                    <ListBulletIcon className="w-8 h-8 text-lightGreenPC flex-shrink-0" />
                    <h3 className="text-white text-2xl font-bold break-words">
                        {title}
                    </h3>
                </div>

                {/* Public/Private indicator */}
                <div className="ml-2">
                    {isPublic ? (
                        <GlobeAltIcon className="w-6 h-6 text-lightGreenPC" title="Public" />
                    ) : (
                        <LockClosedIcon className="w-6 h-6 text-gray-400" title="Private" />
                    )}
                </div>
            </div>

            <p className="text-lightGreenPC text-lg mb-4">
                {recipeCount} {recipeCount === 1 ? 'recipe' : 'recipes'}
            </p>

            {/* Copy to My Lists button */}
            {onCopyList && (
                <button
                    onClick={handleCopyClick}
                    className="w-full py-2 bg-lightGreenPC text-darkBluePC font-bold rounded-lg hover:bg-lightBluePC/80 transition-colors flex items-center justify-center gap-2"
                >
                    <PlusIcon className="w-5 h-5" />
                    Add to My Lists
                </button>
            )}
        </div>
    );
}

export default ListCard;