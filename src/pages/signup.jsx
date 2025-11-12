import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { pushSignup } from "../services/api.js";


/**
 * Page to allow user Signup
 * @returns {React.JSX.Element}
 * @constructor
 */
function Signup() {

    // stores from data and error msgs
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState('');

    // validates a email is formated correctly
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // handles use input in email box displays error msg if invalid email
    const handleEmailChange = (e) => {
        const value = e.target.value;
        setUsername(value);
        if (value === '' || validateEmail(value)) setError('');
        else setError('Please enter a valid email address');
    };

    // handles password input displays error msg for length and matching passwords
    const handlePasswordChange = (e, setPassword, otherPassword) => {
        const value = e.target.value;
        setPassword(value);

        // Compute the other password value
        const pw1 = setPassword === setPassword1 ? value : otherPassword;
        const pw2 = setPassword === setPassword2 ? value : otherPassword;

        // Validate length first
        if (value.length > 0 && value.length < 8) {
            setError("Password must be at least 8 characters");
        } else if (pw1 && pw2 && pw1 !== pw2) {
            setError("Passwords do not match");
        } else {
            setError('');
        }
    };

    // attempts to Register a user in the api
    const registerUser = async (e) => {
        e.preventDefault();
        if (!validateEmail(username)) { setError("Please enter a valid email address"); return; }
        if (password1.length < 8) { setError("Password must be at least 8 characters"); return; }
        if (password1 !== password2) { setError("Passwords do not match"); return; }
        setError('');
        try {
            // Adds user to api navigates to login page
            const signup = await pushSignup(username, password1);
            console.log(signup);
            navigate("/");
        } catch (err) {
            console.log(err);
            setError("Signup failed, please try again");
        } finally {
            setPassword1("");
            setPassword2("");
        }
    };


    //React Code
    return (
        <div className="w-full h-screen bg-darkBluePC flex justify-center items-center">
            <div className="w-full h-full bg-darkBluePC flex justify-center items-center">
                <div className="w-200 h-100 p-8 bg-lightGreenPC rounded-lg shadow-lg flex flex-col justify-center text-white">

                    {/* Dedicated error space */}
                    <div className="min-h-[1.5rem] mb-2">
                        {error && <p className="text-darkBluePC text-center">{error}</p>}
                    </div>

                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 mb-3 rounded-md focus:outline-none focus:ring-2 focus:border-darkBluePC bg-darkBluePC"
                        value={username}
                        onChange={handleEmailChange}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-3 mb-3 rounded-md focus:outline-none focus:ring-2 focus:border-darkBluePC bg-darkBluePC"
                        value={password1}
                        onChange={(e) => handlePasswordChange(e, setPassword1, password2)}
                    />
                    <input
                        type="password"
                        placeholder="Re-enter Password"
                        className="w-full p-3 mb-3 rounded-md focus:outline-none focus:ring-2 focus:border-darkBluePC bg-darkBluePC"
                        value={password2}
                        onChange={(e) => handlePasswordChange(e, setPassword2, password1)}
                    />
                    <button
                        onClick={registerUser}
                        className="w-full py-3 mt-2 bg-lightBluePC hover:bg-darkBluePC text-white font-bold rounded-md"
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Signup;
