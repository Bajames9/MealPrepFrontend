import React from "react";

const IngredientRow = ({ id, amount, unit, ingredient, onDelete, onChange }) => (
    <div key={id} className="w-full h-10 gap-2 flex mt-2">
        <button
            onClick={() => onDelete(id)}
            className="w-1/10 bg-lightGreenPC rounded-2xl hover:bg-red-500 text-white font-bold"
        >
            -
        </button>
        <input
            type="number"
            className="w-2/10 pl-2 rounded-2xl p-2 h-full bg-lightGreenPC"
            placeholder="#"
            value={amount}
            onChange={(e) => onChange(id, "amount", e.target.value)}
        />
        <input
            className="w-2/10 pl-2 rounded-2xl p-2 h-full bg-lightGreenPC"
            placeholder="Unit"
            value={unit}
            onChange={(e) => onChange(id, "unit", e.target.value)}
        />
        <input
            className="w-5/10 pl-2 rounded-2xl p-2 h-full bg-lightGreenPC"
            placeholder="Ingredient"
            value={ingredient}
            onChange={(e) => onChange(id, "ingredient", e.target.value)}
        />
    </div>
);

export default function CreateRecipeIngredients({
                                              ingredients,
                                              addIngredient,
                                              deleteIngredient,
                                              updateIngredient
                                          }) {
    return (
        <div className="flex flex-col text-white m-5 text-xl font-bold w-full h-full gap-2">
            {ingredients.map(item => (
                <IngredientRow
                    key={item.id}
                    id={item.id}
                    amount={item.amount}
                    unit={item.unit}
                    ingredient={item.ingredient}
                    onDelete={deleteIngredient}
                    onChange={updateIngredient}
                />
            ))}

            <button
                onClick={addIngredient}
                className="w-full h-10 bg-lightGreenPC hover:bg-lightBluePC rounded-2xl"
            >
                Add Another Ingredient +
            </button>
        </div>
    );
}
