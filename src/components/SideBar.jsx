import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Main sidebar displayed on most pages to allow for navigation
 * @param className
 * @returns {React.JSX.Element}
 * @constructor
 */
const SideBar = ({ className }) => {

    const [hover, setHover] = useState(false);

    const buttonClass = " w-3/4 h-1/9 shadow-xl bg-lightGreenPC rounded-lg text-4xl hover:text-lightGreenPC hover:bg-overlayPC "

    const navigate = useNavigate();

    const handleHomeCLick = () => {
        navigate("/home")
    }
    const handlePantryClick = () => {
        navigate("/pantry")
    }
    const handleMealPlanClick = () => {
        navigate('/meal-plan')
    }
    const handleListClick = () => {
        navigate('/lists')
    }
    const handleFavoritesClick = () => {
        navigate('/favorites')
    }
    const handleNewRecipeClick = () => {
        navigate('/new-recipe')
    }
    const handleSettingsClick = () => {
        navigate('/settings')
    }


    return (


        <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                transform: hover ? "translateX(-10%)" : "translateX(-80%)",
                transition: "transform 0.3s ease-out",
            }}
            className={`w-100 h-full rounded-4xl fixed ${className}`}
        >
            <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                <button onClick={handleHomeCLick} className={buttonClass}>Home</button>
                <button onClick={handlePantryClick} className={buttonClass}>Pantry</button>
                <button onClick={handleFavoritesClick} className={buttonClass}>Favorites</button>
                <button onClick={handleMealPlanClick} className={buttonClass}>Meal Plan</button>
                <button onClick={handleListClick} className={buttonClass}>My Lists</button>
                <button onClick={handleNewRecipeClick} className={buttonClass}>New Recipe</button>
                <button onClick={handleSettingsClick} className={buttonClass}>Settings</button>
            </div>
        </div>
    )

}

export default SideBar