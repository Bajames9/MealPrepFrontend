import {useEffect, useState} from "react";


function RecipeInstructions({recipe}){




    const [instructions, setInstructions] = useState(null)


    useEffect(() => {
        formatInstructions()
    }, [recipe]);


    function formatInstructions() {
        if (!recipe || !recipe.instructions) return;

        let steps = [];

        try {
            // Parse the instructions JSON string
            const parsed = JSON.parse(recipe.instructions);

            if (Array.isArray(parsed)) {
                // Replace &quot; with " for each step
                steps = parsed.map((step, index) => (
                    <li key={index} className="mb-2">
                        {step.replace(/&quot;/g, '"')}
                    </li>
                ));
            }
        } catch (err) {
            console.error("Error parsing instructions:", err);
        }

        setInstructions(steps);
    }






    return (
        <div>
                <label> Instructions</label>
                {instructions && instructions.length > 0 ? (
                    <ol className="list-decimal list-inside space-x-2">{instructions}</ol>
                ) : (
                    "No instructions available."
                )}

            </div>


    )
}

export default  RecipeInstructions