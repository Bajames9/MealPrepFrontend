import React from "react";

// Individual instruction row
const InstructionRow = ({ id, instruction, onDelete, onChange, indexToDisplay }) => (
    <div key={id} className="w-full h-10 gap-2 flex mt-2">
        <button
            onClick={() => onDelete(id)}
            className="w-1/10 bg-lightGreenPC rounded-2xl hover:bg-red-500 text-white font-bold"
        >
            -
        </button>
        <div
            className="w-1/10 justify-center items-center flex rounded-2xl p-2 h-full"
        >
            {indexToDisplay}.
        </div>
        <input
            className="w-8/10 pl-2 rounded-2xl p-2 h-full bg-lightGreenPC"
            placeholder="Instructions"
            value={instruction}
            onChange={(e) => onChange(id, "instruction", e.target.value)}
        />
    </div>
);

export default function CreateRecipeInstructions({
                                               instructions,
                                               addInstruction,
                                               deleteInstruction,
                                               updateInstruction
                                           }) {
    return (
        <div className="flex flex-col text-white m-5 text-xl font-bold w-full h-full gap-2">
            {instructions.map((item, index) => (
                <InstructionRow
                    key={item.id}
                    id={item.id}
                    instruction={item.instruction}
                    onDelete={deleteInstruction}
                    onChange={updateInstruction}
                    indexToDisplay={index + 1}
                />
            ))}

            <button
                onClick={addInstruction}
                className="w-full h-10 bg-lightGreenPC hover:bg-lightBluePC rounded-2xl"
            >
                Add Instructions
            </button>
        </div>
    );
}
