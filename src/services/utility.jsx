import { whoAmI } from "./api.js";
import RecipeCard from "../components/RecipeCard.jsx";

/**
 * Used for utility functions
 * @returns {Promise<{success}|any|{success: boolean, message: string}|boolean>}
 */

// checks loggin
export const checkLogin = async () => {
    try {
        const loggedIn = await whoAmI();
        if (loggedIn.success) {
            return loggedIn
        } else {
            return false
        }
    } catch (err) {
        console.error("Login check failed:", err);
    }
};



// maps a list of recipes from api into a list of React recipe cards
export const mapRecipeList = (RecipeList, classname) => {

    let recipeCards = ""
    // Check if the inner 'recipes' array exists and is an array
    if (Array.isArray(RecipeList.recipes)) {

        recipeCards = RecipeList.recipes.map((recipe) => {

            // 💡 Log the image URL for each recipe object

            return (
                <RecipeCard
                    key={recipe.id}
                    className={classname}
                    src={recipe.images || recipe.image}
                    title={recipe.name}
                    id={recipe.id}
                />
            );
        });

    } else {
        console.warn("RecipeList.recipes is not an array or is missing.");
    }

    return recipeCards
}





