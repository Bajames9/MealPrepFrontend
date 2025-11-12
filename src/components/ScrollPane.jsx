import {useState} from "react";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

/**
 * Usd To store Items That can be scrolled horizontally using nav buttons
 * @param children
 * @param title
 * @returns {React.JSX.Element}
 * @constructor
 */

function ScrollPane({children , title}){
    const [scrollX, setScrollX] = useState(0);


    //handles Right Scroll navigation
    const handleRightScroll = () => {
        const scrollAmount = 800;
        const totalWidth = children.length * 400;
        if (Math.abs(scrollX) < totalWidth-400) {
            setScrollX((prev) => prev - scrollAmount);
        }
    };
    // handles Left scroll navigation
    const  handleLeftScroll = () => {
        const scrollAmount = 800; // how far to move each click

        if (Math.abs(scrollX) > 0) {
            setScrollX((prev) => prev + scrollAmount);
        }
    }




    //React Code
    return(
        <div className=" w-full h-110 transform  bg-lightBluePC">
            <div className="flex flex-row h-25 items-center transform translate-x-25" >
                <p className="font-bold text-white text-8xl">{title}</p>
                <div className="absolute right-25 flex flex-row gap-4 justify-center">
                    <button onClick={handleLeftScroll} className="w-20 h-20 ">
                        <ChevronLeftIcon className="w-10 h-10 text-black" />
                    </button>
                    <button onClick={handleRightScroll} className="w-20 h-20 ">
                        <ChevronRightIcon className="w-10 h-10 text-black" />
                    </button>
                </div>

            </div>
            <div className="h-75 flex flex-row gap-4  transition-transform duration-700 ease-in-out" style={{
                width: `${(children?.length ?? 0) * 400}px`,
                transform: `translateX(${scrollX+100}px)`,
            }}>
                {children}
            </div>

        </div>
    );



}
export default ScrollPane