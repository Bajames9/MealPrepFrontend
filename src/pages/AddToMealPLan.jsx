import CalendarComponent from "../components/CalendarComponent.jsx";


function AddToMealPLan({onClose, id}){
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-lightBluePC rounded-2xl w-3/4 max-h-[90vh] p-4 flex flex-row items-center justify-center">
                <button onClick={onClose} className="w-50 h-50 bg-lightGreenPC hover:bg-lightGrayPC rounded-2xl text-4xl text-white font-bold transform -translate-y-64">Back</button>
                <CalendarComponent className="" close={onClose} type="inPage" id={id}/>
            </div>
        </div>

    )
}

export default AddToMealPLan