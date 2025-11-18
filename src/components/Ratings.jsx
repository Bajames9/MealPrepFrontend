import { StarIcon as StarOutline } from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";

/**
 * Used to convert Long Between 0 and 5 into arow of start icons
 * @param rating
 * @returns {React.JSX.Element}
 * @constructor
 */
function Ratings({ rating }) {
    return (
       <div className="flex" data-testid="ratings">
            {[1, 2, 3, 4, 5].map((num) => {
                if (num <= Math.floor(rating)) {
                    // full stars
                    return <StarSolid key={num} className="w-6 h-6 text-yellow-400" />;
                } else if (num === Math.ceil(rating) && rating % 1 !== 0) {
                    // partial star
                    const percent = (rating % 1) * 100; // e.g. 0.5 → 50%
                    return (
                        <div key={num} className="relative w-6 h-6">
                            <StarOutline className="absolute w-6 h-6 text-yellow-400" />
                            <div
                                className="absolute top-0 left-0 overflow-hidden"
                                style={{ width: `${percent}%` }}
                            >
                                <StarSolid className="w-6 h-6 text-yellow-400" />
                            </div>
                        </div>
                    );
                } else {
                    // empty stars
                    return <StarOutline key={num} className="w-6 h-6 text-yellow-400" />;
                }
            })}
        </div>
    );
}

export default Ratings;
