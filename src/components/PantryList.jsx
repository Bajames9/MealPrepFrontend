function PantryList({ title, items, loading, onRemove }) {
    const buttonClass = "px-6 py-3 rounded-lg text-xl font-bold transition-colors duration-200";

    return (
        <div className="w-1/4 bg-darkBluePC/80 rounded-2xl shadow-2xl p-8">
            <h2 className="text-white text-3xl font-bold mb-6">{title}</h2>

            {loading ? (
                <p className="text-white text-xl text-center py-6">Loading...</p>
            ) : items.length === 0 ? (
                <p className="text-white text-xl text-center py-8">Nothing here yet.</p>
            ) : (
                <div className="grid gap-4">
                    {items.map((item, i) => (
                        <div
                            key={`${item.name}-${i}`}
                            className="bg-lightBluePC rounded-lg p-4 flex items-center justify-between hover:bg-overlayPC transition-colors"
                        >
                            <div className="flex-1">
                                <h3 className="text-white text-2xl font-bold">{item.name}</h3>
                                <p className="text-lightGreenPC text-lg">
                                    {item.amount} {item.units}
                                </p>
                            </div>

                            <button
                                onClick={() => onRemove(item.name)}
                                className={`${buttonClass} bg-red-500 text-white hover:bg-red-600 flex items-center gap-2`}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
export default PantryList