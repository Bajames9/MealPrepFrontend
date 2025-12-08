/**
 * Api Service Functions
 * @type {string}
 */



// sets the base url of the api
const BASE_URL = "http://localhost:5000"  //"http://54.167.71.175:5000/"; // e.g., "http://localhost:5000"

//Hits the Login endpoint
export const getLogin = async (username, password) => {
    try {
        const response = await fetch(`${BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
            }),
            credentials: 'include',
        });

        // Parse and return the JSON directly from the API
        return await response.json();
    } catch (error) {
        console.error("Login request failed:", error);
        return { success: false, message: "Network or server error" };
    }

};

// hits the Logout endpoint
export const postLogout = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/auth/logout`, {
            method: "POST",
            credentials: "include", // ensures session cookie is sent
        });

        // Parse and return JSON from API
        return await response.json();
    } catch (error) {
        console.error("Logout request failed:", error);
        return { success: false, message: "Network or server error" };
    }
};

export const pushSignup = async (username, password) => {
    try {
        const response = await fetch(`${BASE_URL}/api/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
            }),
            credentials: 'include', //needed for Flask session cookies
        });

        // Parse and return the JSON directly from the API
        return await response.json();
    } catch (error) {
        console.error("signup request failed:", error);
        return { success: false, message: "Network or server error" };
    }

};

// gets a random list of recipes
export const randomRecipes = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/recipes/random`, {
            method: "GET",
        });
        // Parse and return the JSON directly from the API
        return await response.json();
    } catch (error) {
        console.error("Random Recipe", error);
        return { success: false, message: "Network or server error" };
    }
};

// checks if user is logged in also returns username
export const whoAmI = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/auth/whoami`, {
            method: "GET",
            credentials: "include",
        });
        return await response.json();
    } catch (error) {
        if (error.name === "AbortError") throw error; // propagate aborts
        console.error("WhoAmI request failed:", error);
        return { success: false, message: "Network or server error" };
    }
};

export const updateEmail = async (new_email) => {
    try {
        const response = await fetch(`${BASE_URL}/api/auth/update-email`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                new_email,
            }),
            credentials: 'include',
        });

        // Parse and return the JSON directly from the API
        return await response.json();
    } catch (error) {
        console.error("Login request failed:", error);
        return { success: false, message: "Network or server error" };
    }

};
export const updatePassword = async (new_password) => {
    try {
        const response = await fetch(`${BASE_URL}/api/auth/update-password`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                new_password,
            }),
            credentials: 'include',
        });

        // Parse and return the JSON directly from the API
        return await response.json();
    } catch (error) {
        console.error("Login request failed:", error);
        return { success: false, message: "Network or server error" };
    }

};


export const deleteAccount = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/auth/delete-account`, {
            method: "DELETE",
            credentials: 'include',
        });

        // Parse and return the JSON directly from the API
        return await response.json();
    } catch (error) {
        console.error("Login request failed:", error);
        return { success: false, message: "Network or server error" };
    }


}

// Searches for recipes based of a term
export const searchRecipe = async (searchTerm, page = 1, perPage = 20, signal) => {
    try {
        // Construct the query string with all parameters
        const queryParams = new URLSearchParams({
            q: searchTerm,
            page: page.toString(),
            per_page: perPage.toString()
        }).toString();

        const url = `${BASE_URL}/api/recipes/search?${queryParams}`;

        const response = await fetch(
            url,
            { method: "GET", signal }
        );

        // Check for HTTP errors
        if (!response.ok) {
            // Handle non-2xx status codes
            const errorBody = await response.json().catch(() => ({}));
            throw new Error(errorBody.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        if (error.name === "AbortError") throw error; // propagate aborts
        console.error("Search Recipe request failed:", error);

        // Return a standard error response structure
        return {
            success: false,
            message: error.message || "Network or server error"
        };
    }
};

// Searches for Recipes based of Ingredient
export const searchRecipeByIngredients = async (searchTerm, page = 1, perPage = 20, signal) => {
    try {
        // Construct the query string with all parameters
        const queryParams = new URLSearchParams({
            q: searchTerm,
            page: page.toString(),
            per_page: perPage.toString()
        }).toString();

        const url = `${BASE_URL}/api/recipes/search/ingredients?${queryParams}`;

        const response = await fetch(
            url,
            { method: "GET", signal }
        );

        // Check for HTTP errors
        if (!response.ok) {
            // Handle non-2xx status codes
            const errorBody = await response.json().catch(() => ({}));
            throw new Error(errorBody.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        if (error.name === "AbortError") throw error; // propagate aborts
        console.error("Search Recipe request failed:", error);

        // Return a standard error response structure
        return {
            success: false,
            message: error.message || "Network or server error"
        };
    }
};


// gets A individual recipe based of ID
export const getRecipe = async (recipeId) => {
    try {
        const response = await fetch(`${BASE_URL}/api/recipes/${recipeId}`, {
            method: "GET",
        });

        // Parse and return JSON directly from the API
        return await response.json();
    } catch (error) {
        console.error("Get Recipe request failed:", error);
        return { success: false, message: "Network or server error" };
    }
};

// gets a list of recipes from a category
export const getRecipeCategory = async (category) => {
    try {
        const response = await fetch(`${BASE_URL}/api/recipes/category?name=${category}&page=1`, {
            method: "GET",
        });

        // Parse and return JSON directly from the API
        return await response.json();
    } catch (error) {
        console.error("Get Recipe category request failed:", error);
        return { success: false, message: "Network or server error" };
    }
}












// -- PANTRY --

/**
 * Get all pantry items for the logged-in user
 * @returns {Promise} Response with pantry items
 * format: { success: true, items: [{name, amount, units}] }
 */
export const getPantryItems = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/pantry/items`, {
            method: "GET",
            credentials: "include",
        });

        return await response.json();
    } catch (error) {
        console.error("Get pantry items request failed:", error);
        return { success: false, message: "Network or server error" };
    }
};

/**
 * Add, update, or remove pantry items
 * format: Send array of items with amount=0 to delete
 * 
 * @param {Array} items - Array of items [{name, amount, units}]
 * @returns {Promise} Response confirming update
 * 
 * Examples:
 * - Add/Update: updatePantryItems([{name: "Rice", amount: 2.5, units: "cups"}])
 * - Delete: updatePantryItems([{name: "Rice", amount: 0, units: ""}])
 */
export const updatePantryItems = async (items) => {
    try {
        const response = await fetch(`${BASE_URL}/api/pantry/items`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ items }), // Bailey expects: {"items": [...]}
        });

        return await response.json();
    } catch (error) {
        console.error("Update pantry items request failed:", error);
        return { success: false, message: "Network or server error" };
    }
};




export const getGroceryItems = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/grocery/items`, {
            method: "GET",
            credentials: "include",
        });

        return await response.json();
    } catch (error) {
        console.error("Get grocery items request failed:", error);
        return { success: false, message: "Network or server error" };
    }
};

export const updateGroceryItems = async (items) => {
    try {
        const response = await fetch(`${BASE_URL}/api/grocery/items`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ items }), // Bailey expects: {"items": [...]}
        });

        return await response.json();
    } catch (error) {
        console.error("Update pantry items request failed:", error);
        return { success: false, message: "Network or server error" };
    }
};





// FILTER BY RECIPE NAME

/**
 * Search for recipes by recipe name only
 * @param {string} searchTerm - The search query
 * @param {number} page - Page number (default: 1)
 * @param {number} perPage - Items per page (default: 20)
 * @param {AbortSignal} signal - Abort controller signal
 * @returns {Promise} Search results
 */
export const searchRecipeByName = async (searchTerm, page = 1, perPage = 20, signal) => {
    try {
        // Construct the query string with all parameters
        const queryParams = new URLSearchParams({
            q: searchTerm,
            page: page.toString(),
            per_page: perPage.toString()
        }).toString();

        const url = `${BASE_URL}/api/recipes/search/name?${queryParams}`;

        const response = await fetch(
            url,
            { method: "GET", signal }
        );

        // Check for HTTP errors
        if (!response.ok) {
            // Handle non-2xx status codes
            const errorBody = await response.json().catch(() => ({}));
            throw new Error(errorBody.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        if (error.name === "AbortError") throw error; // propagate aborts
        console.error("Search Recipe by Name request failed:", error);

        // Return a standard error response structure
        return {
            success: false,
            message: error.message || "Network or server error"
        };
    }
};



// FAVORITES

/**
 * Get the user's Favorites list
 * Returns the favorites list with recipe_ids
 */
export const getFavoritesList = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/lists/favorites`, {
            method: "GET",
            credentials: "include",
        });

        return await response.json();
    } catch (error) {
        console.error("Get favorites list request failed:", error);
        return { success: false, message: "Network or server error" };
    }
};

/**
 * Add a recipe to favorites
 * @param {number} listId - The favorites list ID
 * @param {number} recipeId - The recipe ID to add
 */
export const addToFavorites = async (listId, recipeId) => {
    try {
        const response = await fetch(`${BASE_URL}/api/lists/update/${listId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ recipe_ids: [recipeId] }),
        });

        return await response.json();
    } catch (error) {
        console.error("Add to favorites request failed:", error);
        return { success: false, message: "Network or server error" };
    }
};

/**
 * Remove a recipe from favorites
 * @param {number} listId - The favorites list ID
 * @param {number} recipeId - The recipe ID to remove
 */
export const removeFromFavorites = async (listId, recipeId) => {
    try {
        const response = await fetch(`${BASE_URL}/api/lists/remove-recipes/${listId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ recipe_ids: [recipeId] }),
        });

        return await response.json();
    } catch (error) {
        console.error("Remove from favorites request failed:", error);
        return { success: false, message: "Network or server error" };
    }
};

/**
 * Generate favorites list (called on signup or manually if needed)
 */
export const generateFavoritesList = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/lists/generate-favorites`, {
            method: "POST",
            credentials: "include",
        });

        return await response.json();
    } catch (error) {
        console.error("Generate favorites list request failed:", error);
        return { success: false, message: "Network or server error" };
    }
};


// RECIPE LISTS

/**
 * Get all list IDs for the logged-in user
 */
export const getAllUserLists = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/lists/all`, {
            method: "GET",
            credentials: "include",
        });
        return await response.json();
    } catch (error) {
        console.error("Get all lists request failed:", error);
        return { success: false, message: "Network or server error" };
    }
};

/**
 * Get a specific list with its recipes
 */
export const getList = async (listId) => {
    try {
        const response = await fetch(`${BASE_URL}/api/lists/get/${listId}`, {
            method: "GET",
            credentials: "include",
        });
        return await response.json();
    } catch (error) {
        console.error("Get list request failed:", error);
        return { success: false, message: "Network or server error" };
    }
};

/**
 * Create a new recipe list
 */
export const createList = async (title, recipeIds = []) => {
    try {
        const response = await fetch(`${BASE_URL}/api/lists/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                title,
                recipe_ids: recipeIds
            }),
        });
        return await response.json();
    } catch (error) {
        console.error("Create list request failed:", error);
        return { success: false, message: "Network or server error" };
    }
};

/**
 * Update a list (add recipes or change title)
 */
export const updateList = async (listId, updates) => {
    try {
        const response = await fetch(`${BASE_URL}/api/lists/update/${listId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(updates), // Can include: recipe_ids, title
        });
        return await response.json();
    } catch (error) {
        console.error("Update list request failed:", error);
        return { success: false, message: "Network or server error" };
    }
};

/**
 * Remove recipes from a list
 */
export const removeRecipesFromList = async (listId, recipeIds) => {
    try {
        const response = await fetch(`${BASE_URL}/api/lists/remove-recipes/${listId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ recipe_ids: recipeIds }),
        });
        return await response.json();
    } catch (error) {
        console.error("Remove recipes request failed:", error);
        return { success: false, message: "Network or server error" };
    }
};

/**
 * Delete an entire list
 */
export const deleteList = async (listId) => {
    try {
        const response = await fetch(`${BASE_URL}/api/lists/remove/${listId}`, {
            method: "DELETE",
            credentials: "include",
        });
        return await response.json();
    } catch (error) {
        console.error("Delete list request failed:", error);
        return { success: false, message: "Network or server error" };
    }
};


// RECOMMENDATIONS

/**
 * Get personalized recipe recommendations based on user's pantry items
 */
export const getRecommendations = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/recipes/recommendations`, {
            method: "GET",
            credentials: "include",
        });
        return await response.json();
    } catch (error) {
        console.error("Get recommendations request failed:", error);
        return { success: false, message: "Network or server error" };
    }
};



/**
 * Search public lists by title
 * @param {string} searchTerm - The search query
 * @param {number} page - Page number (default: 1)
 * @param {number} perPage - Items per page (default: 20)
 * @param {AbortSignal} signal - Abort controller signal
 * @returns {Promise} Search results
 */
export const searchPublicLists = async (searchTerm, page = 1, perPage = 20, signal) => {
    try {
        const queryParams = new URLSearchParams({
            q: searchTerm,
            page: page.toString(),
            per_page: perPage.toString()
        }).toString();

        const url = `${BASE_URL}/api/lists/search-public?${queryParams}`;

        const response = await fetch(url, {
            method: "GET",
            signal
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            throw new Error(errorBody.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        if (error.name === "AbortError") throw error;
        console.error("Search public lists request failed:", error);
        return {
            success: false,
            message: error.message || "Network or server error"
        };
    }
};

/**
 * Copy a public list to user's own lists
 * Creates a new list with the same recipes
 */
export const copyPublicList = async (listId, newTitle) => {
    try {
        // First get the public list details
        const listResponse = await getList(listId);

        if (!listResponse.success || !listResponse.list) {
            return { success: false, message: "Failed to fetch list details" };
        }

        // Create a new list with the same recipe IDs
        const response = await createList(
            newTitle || `Copy of ${listResponse.list.title}`,
            listResponse.list.recipe_ids || []
        );

        return response;
    } catch (error) {
        console.error("Copy public list request failed:", error);
        return { success: false, message: "Network or server error" };
    }
};

/**
 * Get missing ingredients for a recipe based on user's pantry
 * @param {number} recipeId - The recipe ID
 */
export const getMissingIngredients = async (recipeId) => {
    try {
        const response = await fetch(`${BASE_URL}/api/recipes/${recipeId}/missing-ingredients`, {
            method: "GET",
            credentials: "include",
        });
        return await response.json();
    } catch (error) {
        console.error("Get missing ingredients request failed:", error);
        return { success: false, message: "Network or server error" };
    }
};


// -- MEAL PLAN --

export const addMealPlan = async (mealDate, mealType, recipeId) => {
    try {
        const response = await fetch(`${BASE_URL}/api/meal_plan/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                mealDate,
                mealType,
                recipeId
            }),
        });

        return await response.json();
    } catch (error) {
        console.error("Add Meal Plan request failed:", error);
        return { success: false, message: "Network or server error" };
    }
};

export const getMealPlan = async (mealDate) => {
    try {
        const url = mealDate
            ? `${BASE_URL}/api/meal_plan/get?mealDate=${mealDate}`
            : `${BASE_URL}/api/meal_plan/get`;

        const response = await fetch(url, {
            method: "GET",
            credentials: "include",
        });

        return await response.json();
    } catch (error) {
        console.error("Get Meal Plan request failed:", error);
        return { success: false, message: "Network or server error" };
    }
};

export const removeMealPlan = async (mealDate, mealType) => {
    try {
        const response = await fetch(`${BASE_URL}/api/meal_plan/delete`, {
            method: "DELETE",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mealDate, mealType })
        });

        return await response.json();
    } catch (error) {
        console.error("Remove Meal Plan request failed:", error);
        return { success: false, message: "Network or server error" };
    }

};

export const getUserMadeRecipes = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/user_recipes/get`, {
            method: "GET",
            credentials: "include",
        });

        return await response.json();
    } catch (error) {
        console.error("Get user recipes failed:", error);
        return { success: false, message: "Network or server error" };
    }
};




/**
 * Add a new user-made recipe
 * @param {Object} recipeData - Full recipe JSON object
 */
export const addUserMadeRecipe = async (recipeData) => {
    try {
        const response = await fetch(`${BASE_URL}/api/user_recipes/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(recipeData),
        });

        return await response.json();
    } catch (error) {
        console.error("Add recipe failed:", error);
        return { success: false, message: "Network or server error" };
    }
};


/**
 * Update an existing user-made recipe
 * @param {number} recipeId - ID from database
 * @param {Object} updatedRecipe - Updated recipe JSON
 */
export const updateUserMadeRecipe = async (recipeId, updatedRecipe) => {
    try {
        const response = await fetch(`${BASE_URL}/api/user_recipes/update/${recipeId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(updatedRecipe),
        });

        return await response.json();
    } catch (error) {
        console.error("Update recipe failed:", error);
        return { success: false, message: "Network or server error" };
    }
};


/**
 * Delete a user-made recipe
 * @param {number} recipeId - Recipe ID
 */
export const deleteUserMadeRecipe = async (recipeId) => {
    try {
        const response = await fetch(`${BASE_URL}/api/user_recipes/delete/${recipeId}`, {
            method: "DELETE",
            credentials: "include",
        });

        return await response.json();
    } catch (error) {
        console.error("Delete recipe failed:", error);
        return { success: false, message: "Network or server error" };
    }
};

/**
 * Mark recipe as submitted
 * @param {number} recipeId
 */
export const submitUserRecipe = async (recipeId) => {
    try {
        const response = await fetch(`${BASE_URL}/api/user_recipes/submit/${recipeId}`, {
            method: "PUT",
            credentials: "include",
        });

        return await response.json();
    } catch (error) {
        console.error("Submit recipe failed:", error);
        return { success: false, message: "Network or server error" };
    }
};


/**
 * Get ALL saved user-made recipes (drafts + submitted)
 */
export const getAllUserSavedRecipes = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/user_recipes/get/all`, {
            method: "GET",
            credentials: "include",
        });

        return await response.json();
    } catch (error) {
        console.error("Get all saved recipes failed:", error);
        return { success: false, message: "Network or server error" };
    }
};

// Example of the new service function to add to api.js
export const unsubmitUserRecipe = async (recipeId) => {
    if (!recipeId) return { success: false, message: "Recipe ID is missing" };
    try {
        const response = await fetch(`${BASE_URL}/api/user_recipes/unsubmit/${recipeId}`, {
            method: "PUT",
            credentials: "include",
        });
        return await response.json();
    } catch (error) {
        console.error("Unsubmit recipe failed:", error);
        return { success: false, message: "Network or server error" };
    }
};


/**
 * Get ALL submitted user-made recipes (ADMIN ONLY)
 */
export const getAllSubmittedUserRecipesAdmin = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/user_recipes/get/submitted/all`, {
            method: "GET",
            credentials: "include", // ✅ required for session auth
        });

        return await response.json();
    } catch (error) {
        console.error("Admin fetch submitted recipes failed:", error);
        return { success: false, message: "Network or server error" };
    }
};


/**
 * Approve a user-submitted recipe and add it to the main recipes table
 * Admin-only action
 * @param {number} userRecipeId - ID of the user-submitted recipe
 */
export const approveUserRecipe = async (userRecipeId) => {
    if (!userRecipeId) {
        console.error("No recipe ID provided for approval");
        return { success: false, message: "No recipe selected" };
    }

    try {
        const response = await fetch(`${BASE_URL}/api/user_recipes/admin/approve_recipe/${userRecipeId}`, {
            method: "POST",
            credentials: "include", // include cookies/session
        });

        return await response.json();
    } catch (error) {
        console.error("Approve recipe failed:", error);
        return { success: false, message: "Network or server error" };
    }
};


/**
 * Fetches a single user-made recipe by its ID.
 * @param {number} recipeId - The ID of the user recipe to fetch.
 */
export const getUserRecipeById = async (recipeId) => {
    if (!recipeId) return { success: false, message: "Recipe ID is missing" };
    try {
        const response = await fetch(`${BASE_URL}/api/user_recipes/get/${recipeId}`, {
            method: "GET",
            credentials: "include",
        });
        return await response.json();
    } catch (error) {
        console.error(`Get recipe by ID ${recipeId} failed:`, error);
        return { success: false, message: "Network or server error" };
    }
};