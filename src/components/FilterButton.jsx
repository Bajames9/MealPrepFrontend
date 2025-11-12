import { Bars3CenterLeftIcon, FunnelIcon, BookOpenIcon, ListBulletIcon } from "@heroicons/react/24/outline";
import ToggleButton from "@mui/material/ToggleButton";
import { useState } from "react";

/**
 * Component Used For Search Filters
 * Now supports Ingredients, Recipe Name, and Lists filters
 */
function FilterButton({
    onToggleIngredients,
    isIngredientsSelected,
    onToggleRecipeName,
    isRecipeNameSelected,
    onToggleLists,
    isListsSelected
}) {
    const [expanded, setExpanded] = useState(false);

    const handleIngredientToggle = () => {
        if (!isIngredientsSelected) {
            onToggleRecipeName(false);
            onToggleLists(false);
        }
        onToggleIngredients(!isIngredientsSelected);
    };

    const handleRecipeNameToggle = () => {
        if (!isRecipeNameSelected) {
            onToggleIngredients(false);
            onToggleLists(false);
        }
        onToggleRecipeName(!isRecipeNameSelected);
    };

    const handleListsToggle = () => {
        if (!isListsSelected) {
            onToggleIngredients(false);
            onToggleRecipeName(false);
        }
        onToggleLists(!isListsSelected);
    };

    const buttonStyle = {
        backgroundColor: 'var(--color-lightBluePC)',
        color: 'var(--color-darkBluePC)',
        fontWeight: 'bold',
        '&:hover': {
            backgroundColor: 'var(--color-overlayPC)',
            color: 'var(--color-darkBluePC)',
            '@media (hover: hover)': {
                backgroundColor: 'var(--color-overlayPC)',
            }
        },
        '&.Mui-selected': {
            backgroundColor: 'var(--color-darkBluePC)',
            color: 'white',
            '&:hover': {
                backgroundColor: 'var(--color-overlayPC)',
                color: 'white',
            }
        },
        width: '80%',
        mt: 2,
    };

    return (
        <button
            onClick={() => setExpanded(true)}
            onMouseLeave={() => setExpanded(false)}
            className="w-1/30 h-15 shadow-xl bg-lightGreenPC rounded-2xl hover:bg-overlayPC z-20 justify-center">
            <Bars3CenterLeftIcon className="w-10 h-10 text-gray-700 transform" />
            <div className="h-10 w-5/30 absolute transform -translate-x-12/30" />

            <div
                className={`w-5/30 bg-lightGreenPC rounded-2xl drop-shadow-2xl absolute transform -translate-x-12/30 translate-y-8 transition-all duration-500 ease-in-out`}
                style={{
                    height: expanded ? "80%" : "0%",
                    opacity: expanded ? "100%" : "0%"
                }}
            >
                {/* Ingredients Filter */}
                <ToggleButton
                    value="ingredients"
                    selected={isIngredientsSelected}
                    onChange={handleIngredientToggle}
                    size="small"
                    color="primary"
                    aria-label="search by ingredients toggle"
                    sx={buttonStyle}
                >
                    <FunnelIcon className="h-5 w-5 mr-1" />
                    <span className="text-sm">Ingredients</span>
                </ToggleButton>

                {/* Recipe Name Filter */}
                <ToggleButton
                    value="recipeName"
                    selected={isRecipeNameSelected}
                    onChange={handleRecipeNameToggle}
                    size="small"
                    color="primary"
                    aria-label="search by recipe name toggle"
                    sx={buttonStyle}
                >
                    <BookOpenIcon className="h-5 w-5 mr-1" />
                    <span className="text-sm">Recipe Name</span>
                </ToggleButton>

                {/* Lists Filter */}
                <ToggleButton
                    value="lists"
                    selected={isListsSelected}
                    onChange={handleListsToggle}
                    size="small"
                    color="primary"
                    aria-label="search public lists toggle"
                    sx={{ ...buttonStyle, mb: 2 }}
                >
                    <ListBulletIcon className="h-5 w-5 mr-1" />
                    <span className="text-sm">Lists</span>
                </ToggleButton>
            </div>
        </button>
    );
}

export default FilterButton;