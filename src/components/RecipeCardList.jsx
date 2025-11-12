import RecipeCard from "./RecipeCard.jsx";

// used to map a lists of recipes into a list of Recipe cards
function RecipeCardList({recipes}){


    if (recipes){

        const recipeCards = recipes.recipes.map((recipe) => (



            <RecipeCard
                key={recipe.id}
                className="bg-lightGreenPC"
                src={recipe.image}
                title={recipe.name}
            />
        ));


        return <div className="flex flex-row gap-4 p-4 overflow-x-auto">
            {recipeCards}
        </div>


    } else {

        return  <p className="text-white text-xl p-4">Loading recipes...</p>
    }


}

export default RecipeCardList