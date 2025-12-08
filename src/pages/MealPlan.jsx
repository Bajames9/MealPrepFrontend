import SideBar from "../components/SideBar.jsx";
import MealPlanDay from "../components/MealPlanDay.jsx";
import CalendarComponent from "../components/CalendarComponent.jsx";


/**
 * placeholder page to be worked on in future Sprint
 * @returns {React.JSX.Element}
 * @constructor
 */
function MealPlan() {
    return <div className="bg-lightBluePC w-full h-screen">
        <div className="w-full h-full  flex ">
            <SideBar    className="font-black bg-darkBluePC/65 absolute z-10"
            />
            <div className="flex justify-center items-center w-full h-full">
                <CalendarComponent className="transform translate-x-30"/>
            </div>


        </div>
    </div>
}
export default MealPlan