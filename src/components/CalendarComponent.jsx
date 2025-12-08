import * as React from "react"
import MealPlanDay from "./MealPlanDay.jsx";
import RecipeCard from "./RecipeCard.jsx";
import {useState} from "react";

// Outline version
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import {addMealPlan} from "../services/api.js";
import InPageMealPlan from "./InPageMealPlan.jsx";

// Solid version
//import { PlusCircleIcon } from '@heroicons/react/24/solid';




function CalendarComponent({className, type = 'normal', id, close}) {

    const typeClasses = {
        normal: "w-2/8",
        inPage: "w-103.5"
    };

    let cardSize = 'mealPlan'
    if(type == "inPage"){
        cardSize = 'inPage'
    }



    function createDatesForMonth(month, year){



        const lastDayOfMonth = new Date(year, month, 0);
        const daysInMonth = lastDayOfMonth.getDate();

        const firstDayOfMonth = new Date(year, month - 1, 1);
        const startDayOfWeek = firstDayOfMonth.getDay();

        let dates = []
        for (let i = 0; i < daysInMonth + startDayOfWeek; i++){
            if(i < startDayOfWeek){
                dates[i] = <div ></div>
            }
            else {
                dates[i] = <button
                    key={i}
                    className="bg-darkBluePC hover:bg-lightGrayPC transition-colors duration-200 text-white p-4 text-center rounded-md font-bold cursor-pointer"
                    onClick={() => getDay(
                        month, // Assuming 'month' is available in scope
                        i - startDayOfWeek + 1, // The actual day number (1 to 31)
                        year,

                    )}
                >
                    {i-startDayOfWeek+1}
                </button>
            }
        }



        return dates

    }

    function getDay(month, day, year) {
        const newDate = new Date(year, month - 1, day); // JS months are 0-indexed
        setActiveDate(newDate); // <- this updates the prop for InPageMealPlan
        setTitle(`${month}/${day}/${year}`);
        setRecipes(tempList);
    }



    async function addToMealPlan(month, day, year, id, mealType) {
        // Format date as YYYY-MM-DD
        const formattedMonth = month.toString().padStart(2, "0");
        const formattedDay = day.toString().padStart(2, "0");
        const mealDate = `${year}-${formattedMonth}-${formattedDay}`;

        try {
            const result = await addMealPlan(mealDate, mealType, id);

            if (result.success) {
                console.log(`Meal added successfully for ${mealDate} (${mealType})!`);
            } else {
                console.error(`Failed to add meal for ${mealDate}:`, result.message);
            }
        } catch (error) {
            console.error(`Unexpected error adding meal for ${mealDate}:`, error);
        }
    }


    const tempList = [

        <RecipeCard
            key="49"
            className="bg-lightGreenPC"
            src="https://img.sndimg.com/food/image/upload/w_555,h_416,c_fit,fl_progressive,q_95/v1/img/recipes/49/m1z1F8S5mAZgyImm5zYw_Lombardi%20Chicken%203.jpg"
            title="Chicken Breasts Lombardi"
            size={cardSize}
        />,
        <RecipeCard
            key="49"
            className="bg-lightGreenPC"
            src="https://img.sndimg.com/food/image/upload/w_555,h_416,c_fit,fl_progressive,q_95/v1/img/recipes/49/m1z1F8S5mAZgyImm5zYw_Lombardi%20Chicken%203.jpg"
            title="Chicken Breasts Lombardi"
            size={cardSize}
        />,
        <RecipeCard
            key="49"
            className="bg-lightGreenPC"
            src="https://img.sndimg.com/food/image/upload/w_555,h_416,c_fit,fl_progressive,q_95/v1/img/recipes/49/m1z1F8S5mAZgyImm5zYw_Lombardi%20Chicken%203.jpg"
            title="Chicken Breasts Lombardi"
            size={cardSize}
        />

    ]




    const [activeDate, setActiveDate] = useState(new Date());
    const [title, setTitle] = useState(`${activeDate.getMonth()+1}/${activeDate.getDate()}/${activeDate.getFullYear()}`);
    const [recipes, setRecipes] = useState(tempList)




    const days = createDatesForMonth(activeDate.getMonth()+1,activeDate.getFullYear())

    return (

        <div className={`flex flex-row items-center gap-4 w-7/8 h-8/10 p-5  ${className}`} >
            <div className="bg-darkBluePC rounded-2xl w-5/8 p-3 h-full">
                <div className="flex flex-col justify-center w-full h-full rounded-2xl text-2xl">
                    <div className="flex flex-row justify-center w-full h-1/8 gap-4" >
                        <button onClick={() => {
                            setActiveDate(prev => {
                                const newDate = new Date(prev);
                                newDate.setFullYear(newDate.getFullYear() - 1);
                                return newDate;
                            });
                        }} className="bg-lightGreenPC text-white p-4 text-center rounded-md font-bold">{"<<"}</button>

                        <button onClick={() => {
                            setActiveDate(prev => {
                                const newDate = new Date(prev);
                                newDate.setMonth(newDate.getMonth() - 1);
                                return newDate;
                            });
                        }} className="bg-lightGreenPC text-white p-4 text-center rounded-md font-bold">{"<"}</button>
                        <div className="w-1/2 bg-lightGreenPC text-white p-4 rounded-md font-bold flex justify-center items-center">
                            {activeDate.toLocaleString('en-US', { month: 'long' })} {activeDate.getFullYear()}
                        </div>
                        <button onClick={() => {
                            setActiveDate(prev => {
                                const newDate = new Date(prev);
                                newDate.setMonth(newDate.getMonth() + 1);
                                return newDate;
                            });
                        }} className="bg-lightGreenPC text-white p-4 text-center rounded-md font-bold">{">"}</button>
                        <button onClick={() => {
                            setActiveDate(prev => {
                                const newDate = new Date(prev);
                                newDate.setFullYear(newDate.getFullYear() + 1);
                                return newDate;
                            });
                        }} className="bg-lightGreenPC text-white p-4 text-center rounded-md font-bold">{">>"}</button>


                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-7 grid-rows-7 gap-4 bg-lightBluePC p-4 rounded-lg shadow-md">
                            <div className="bg-lightGreenPC text-white p-4 text-center rounded-md font-bold">S</div>
                            <div className="bg-lightGreenPC text-white p-4 text-center rounded-md font-bold">M</div>
                            <div className="bg-lightGreenPC text-white p-4 text-center rounded-md font-bold">T</div>
                            <div className="bg-lightGreenPC text-white p-4 text-center rounded-md font-bold">W</div>
                            <div className="bg-lightGreenPC text-white p-4 text-center rounded-md font-bold">T</div>
                            <div className="bg-lightGreenPC text-white p-4 text-center rounded-md font-bold">F</div>
                            <div className="bg-lightGreenPC text-white p-4 text-center rounded-md font-bold">S</div>
                            {days}
                        </div>
                    </div>
                </div>
            </div>
            <div className={`${typeClasses[type]} h-full`}>
                {type === "normal" ? (
                    <MealPlanDay title={title} date={activeDate} recipes={recipes} />
                ) : (
                    <InPageMealPlan activeDate={activeDate} close={close} id={id} />
                )}



            </div>

        </div>



    )
}
//div className={`${typeClasses[type]} h-full`}>
//<MealPlanDay title={title} recipes={recipes} />
export default CalendarComponent
