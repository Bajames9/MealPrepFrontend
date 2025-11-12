import SideBar from "../components/SideBar.jsx";

/**
 * Page Template USed for adding new pages sets up a blank page with sidebar content can be added to innermost div to fill out page
 * @returns {React.JSX.Element}
 * @constructor
 */

function PageTemplate() {
    return <div className="bg-lightBluePC w-full h-screen">
        <div className="w-full h-full  flex ">
            {/*Sidebar used for navigation*/}
            <SideBar    className="font-black bg-darkBluePC/65 absolute z-10"
            />
            {/*Div to put New content*/}
            <div className="flex justify-center items-center w-full">
                {/*Example Content*/}
                <p className="font-bold items-center text-white text-9xl">Template</p>
            </div>

        </div>
    </div>

}
export default PageTemplate