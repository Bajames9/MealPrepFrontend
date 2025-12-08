import SideBar from "../components/SideBar.jsx";
import Ratings from "../components/Ratings.jsx";
import RecipeInstructions from "../components/recipeInstructions.jsx";
import RecipeIngredients from "../components/recipeIngredients.jsx";
import React, {useState} from "react";
import RecipeSubmissionForm from "../components/RecipeSubmissionForm.jsx";


/**
 * placeholder page to be worked on in future Sprint
 * @returns {React.JSX.Element}
 * @constructor
 */





function CreateRecipe(){






    return <div className="bg-lightBluePC w-full h-screen">
        <div className="w-full h-full  flex ">
            <SideBar    className="font-black bg-darkBluePC/65 absolute z-10"/>
            <div className="flex justify-center items-center w-full">

                <RecipeSubmissionForm

                />

            </div>


        </div>
    </div>
}
export default CreateRecipe