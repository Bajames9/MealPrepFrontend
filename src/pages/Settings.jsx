import SideBar from "../components/SideBar.jsx";
import React, { useEffect, useState } from "react";

import { deleteAccount, postLogout, updateEmail, updatePassword, whoAmI } from "../services/api.js";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../contexts/FavoritesContext.jsx";


/**
 * Settings page handles user account updates logout and any other settings we create
 * @returns {React.JSX.Element}
 * @constructor
 */

function Settings() {
    const navigate = useNavigate();
    const { clearFavorites } = useFavorites();

    // used to display users name
    const [username, setUsername] = useState('');
    const [update, setUpdate] = useState('');
    const [admin, setAdmin] = useState(false)

    //makes sure user is logged in if not redirects to login page
    useEffect(() => {
        const checkLogin = async () => {
            try {
                const loggedIn = await whoAmI();
                if (loggedIn.success) {
                    setUsername(loggedIn.user);
                    if (loggedIn.admin){
                        setAdmin(true)
                    }
                } else {
                    alert("Not Logged In As User")
                    navigate("/")
                }
            } catch (err) {
                console.error("Login check failed:", err);
            }
        };

        checkLogin();
    }, []);


    // used to update email
    const handleEmailUpdate = async () => {
        const confirmed = window.confirm("Are you sure you want to update your email?");
        if (confirmed) {
            try {
                const result = await updateEmail(update)
                if (result.success) {
                    alert(result.message);
                } else {
                    alert(result.message);
                }
            } catch (err) {
                console.error("Email update failed:", err);
                alert("An error occurred during update");
            }
        }
    };




    //used to update password
    const handlePasswordUpdate = async () => {

        const confirmed = window.confirm("Are you sure you want to update your Password?");
        if (confirmed) {
            try {
                const result = await updatePassword(update)
                if (result.success) {
                    alert(result.message);
                } else {
                    alert(result.message);
                }
            } catch (err) {
                console.error("password update failed:", err);
                alert("An error occurred during update");
            }
        }
    }

    // used tp delete account
    const handleAccountDeletion = async () => {
        const confirmed = window.confirm("Are you sure you want to update your Account This can not be undone!!!");
        if (confirmed) {
            try {
                const result = await deleteAccount(update)
                if (result.success) {
                    alert(result.message);
                    clearFavorites(); // Clear favorites on account deletion
                    navigate("/")
                } else {
                    alert(result.message);
                }
            } catch (err) {
                console.error("Account Deletion failed:", err);
                alert("An error occurred during Deletion");
            }
        }
    }

    // used to log out and redirect user
    const logout = async () => {
        try {
            const result = await postLogout();
            if (result.success) {
                clearFavorites(); // Clear favorites on logout
                alert(result.message); // optional: show "Logout successful"
                navigate("/");         // redirect to login/home page
            } else {
                alert(result.message || "Logout failed");
            }
        } catch (err) {
            console.error("Logout failed:", err);
            alert("An error occurred during logout");
        }
    };

    const handleAdminClick = () => {
        navigate('/admin')
    }


    // used for styling of multiple buttons to make code cleaner
    const buttonClass = " w-3/4 h-2/9 shadow-xl bg-lightGreenPC rounded-lg text-4xl hover:text-lightGreenPC hover:bg-overlayPC "


    // React Code
    return <div className="bg-lightBluePC w-full h-screen">
        <div className="w-full h-full  flex ">
            <SideBar className="font-black bg-darkBluePC/65 absolute z-10"
            />
            <div className="flex flex-col justify-center items-center w-full gap-4">
                {/*Used to display account update forms and username*/}
                <div className="w-4/8 h-4/9  flex flex-col justify-center items-center  gap-4">
                    <p className="text-4xl text-white">Account Info: {username}</p>
                    <input
                        className={`w-3/4 h-1/9 shadow-xl bg-lightGreenPC rounded-lg text-4xl hover:text-lightGreenPC hover:bg-overlayPC `}
                        value={update}
                        onChange={(e) => setUpdate(e.target.value)}
                    />
                    <button onClick={handleEmailUpdate} className={buttonClass}>Update Email</button>
                    <button onClick={handlePasswordUpdate} className={buttonClass}>Update Password</button>

                </div>
                <hr className="w-5/8 border-2 border-darkBluePC rounded" />
                {/*Buttons for other  settings actions Most are placeholders currently have Logout and Delete added*/}
                <div className="w-4/8 h-4/9 flex flex-row flex-wrap gap-4 justify-center items-center">
                    <button onClick={logout} className="w-1/6 h-2/6 shadow-xl bg-lightGreenPC rounded-lg text-4xl hover:text-lightGreenPC hover:bg-overlayPC ">Logout</button>
                    <button onClick={handleAccountDeletion} className="w-1/6 h-2/6 shadow-xl bg-lightGreenPC rounded-lg text-4xl hover:text-lightGreenPC hover:bg-overlayPC ">Delete Account</button>
                    {admin && <button onClick={handleAdminClick} className="w-1/6 h-2/6 shadow-xl bg-lightGreenPC rounded-lg text-4xl hover:text-lightGreenPC hover:bg-overlayPC ">Admin</button>}



                </div>
            </div>

        </div>
    </div>

}
export default Settings