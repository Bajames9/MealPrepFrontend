import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLogin, whoAmI } from "../services/api.js";
import { useFavorites } from "../contexts/FavoritesContext.jsx";


/**
 * Login Page handles login and redirects users to homepage if logged in
 * @returns {React.JSX.Element}
 * @constructor
 */

function Login() {

    //used to manage form inputs and error messages
    const navigate = useNavigate();
    const { reloadFavorites } = useFavorites();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');


    // checks if user is logged in on page load redirects user to homepage if logged in
    useEffect(() => {
        //hits the whoami endpoint to check user logged in status
        const checkLogin = async () => {
            try {
                // hits utility function in api.js to interact with api returns api response
                const loggedIn = await whoAmI();
                // if logged in navigate to home
                if (loggedIn.success) {
                    // Reload favorites when already logged in
                    await reloadFavorites();
                    navigate("/home");
                }
            }
            // logs any error msg
            catch (err) {
                console.error("Login check failed:", err);
            }
        };
        // runs the function done this way to prevent rerender errors
        checkLogin();
    }, []);


    // function used to interact with api to attempt login
    const handleLogin = async (e) => {
        // used to precent default behavior of component function is called from can potential to cause issues if missing
        e.preventDefault();
        try {
            // hits api.js function to attempt login returns api response
            const login = await getLogin(username, password);
            // if login works navigates to homepage
            if (login.success) {
                // Reload favorites after successful login
                await reloadFavorites();
                navigate("/home");
            } else {
                setError(login.message);
            }
        } catch (err) {
            console.log(err);
            // sets the error displayed on screen to inform user
            setError("Login failed, please try again");
        } finally {
            // wipes the password from memory
            setPassword("");
        }
    };

    // used to handle button navigation for quest users and signup
    const handleSignup = () => navigate("/signup");
    const handleGuest = () => navigate("/home");


    // returns the React page
    return (
        <div className="flex w-screen h-screen">
            {/* Left side */}
            <div className="w-1/2 bg-lightGreenPC" />

            {/* Right side */}
            <div className="w-1/2 flex justify-center items-center bg-gray-800">
                <div className="w-full max-w-md p-8 bg-lightGreenPC rounded-lg shadow-lg flex flex-col items-center">

                    {/* Dedicated error space */}
                    <div className="min-h-[1.5rem] mb-4 w-full">
                        {error && <p className="text-darkBluePC text-center">{error}</p>}
                    </div>

                    {/*Used to input email*/}
                    <input
                        type="text"
                        placeholder="Email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-3 mb-3 rounded-md bg-darkBluePC text-white border-2 border-gray-400 focus:outline-none focus:ring-2 focus:ring-darkBluePC focus:border-darkBluePC"
                    />
                    {/*Used to input Password*/}
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 mb-3 rounded-md bg-darkBluePC text-white border-2 border-gray-400 focus:outline-none focus:ring-2 focus:ring-darkBluePC focus:border-darkBluePC"
                    />
                    {/*button that attempts to login*/}
                    <button
                        onClick={handleLogin}
                        className="w-full py-3 mt-2 bg-lightBluePC hover:bg-darkBluePC text-white font-bold rounded-md"
                    >
                        Login
                    </button>

                    <hr className="my-4 border-darkBluePC w-full" />

                    {/*Alternate navigation buttons for quest user and signup*/}
                    <div className="flex gap-4 w-full">
                        <button
                            onClick={handleSignup}
                            className="flex-1 h-16 rounded-md   bg-lightBluePC hover:bg-darkBluePC text-white font-bold"
                        >
                            Signup
                        </button>
                        <button
                            onClick={handleGuest}
                            className="flex-1 h-16 rounded-md bg-lightBluePC hover:bg-darkBluePC text-white font-bold"
                        >
                            Guest
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;