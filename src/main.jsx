import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from "./pages/login.jsx";
import Signup from "./pages/signup.jsx";
import Home from "./pages/Home.jsx";
import './css/main.css'
import Pantry from "./pages/Pantry.jsx";
import MealPlan from "./pages/MealPlan.jsx";
import Lists from "./pages/Lists.jsx";
import ListDetail from "./pages/ListDetail.jsx";
import CreateRecipe from "./pages/CreateRecipe.jsx";
import Settings from "./pages/Settings.jsx";
import RecipePage from "./pages/RecipePage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import Favorites from "./pages/Favorites.jsx";
import { FavoritesProvider } from "./contexts/FavoritesContext.jsx";
import PublicListsSearchPage from "./pages/PublicListsSearchPage.jsx";
import RecipePageNew from "./pages/RecipePageNew.jsx";
import Admin from "./pages/Admin.jsx";

/**
 * Main Entry point for code sets up paths for recipe pages
 * @type {Router$1}
 */

const router = createBrowserRouter([
    // Each one of these is the path for a url of the site and what react page it renders
    {
        path: '/',
        element: <Login />,
    },
    {
        path: '/signup',
        element: <Signup />,
    },
    {
        path: '/home',
        element: <Home />,
    },
    {
        path: '/pantry',
        element: <Pantry />,
    },
    {
        path: '/meal-plan',
        element: <MealPlan />,
    },
    {
        path: '/lists',
        element: <Lists />,
    },
    {
        path: '/lists/:listId',
        element: <ListDetail />,
    },
    {
        path: '/favorites',
        element: <Favorites />,
    },
    {
        path: '/new-recipe',
        element: <CreateRecipe />,
    },
    {
        path: '/settings',
        element: <Settings />,
    },
    {
        path: "/recipe/:id",
        element: <RecipePageNew />,

    },
    {
        path: "/search/:term",
        element: <SearchPage />,

    },
    {
        path: '/lists/search/:term',
        element: <PublicListsSearchPage />,
    },
    {
        path: '/admin',
        element: <Admin/>,
    },



]);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <FavoritesProvider>
            <RouterProvider router={router} />
        </FavoritesProvider>
    </StrictMode>
);