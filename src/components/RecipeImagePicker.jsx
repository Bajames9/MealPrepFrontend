import React, { useState, useRef } from "react";



function RecipeImagePicker({ selectedImage, setSelectedImage }) {
    const fileInputRef = useRef(null);

    const handlePlusClick = () => {
        // Programmatically click the hidden file input
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file); // temporary URL for preview
            setSelectedImage(url);
        }
    };

    return (
        <div className="relative w-full h-64 rounded-2xl overflow-hidden border">
            <img
                className="w-full h-full object-cover"
                src={
                    selectedImage ||
                    "https://img.sndimg.com/food/image/upload/f_auto,c_thumb,q_55,w_860,ar_3:2/v1/gk-static/gk/img/recipe-default-images/image-00.svg"
                }
                alt="Recipe"
            />

            {/* Plus button */}
            <button
                onClick={handlePlusClick}
                className="absolute top-2 right-2 bg-lightGreenPC text-white font-bold text-2xl w-10 h-10 rounded-full flex items-center justify-center hover:bg-lightBluePC"
                type="button"
            >
                +
            </button>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    );
}

export default RecipeImagePicker;
