import { HashRouter, Routes, Route } from 'react-router-dom'
import { createRoot } from "react-dom/client";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <FavoritesProvider>
            <HashRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/pantry" element={<Pantry />} />
                    <Route path="/meal-plan" element={<MealPlan />} />
                    <Route path="/lists" element={<Lists />} />
                    <Route path="/lists/:listId" element={<ListDetail />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/new-recipe" element={<CreateRecipe />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/recipe/:id" element={<RecipePage />} />
                    <Route path="/search/:term" element={<SearchPage />} />
                    <Route path="/lists/search/:term" element={<PublicListsSearchPage />} />
                </Routes>
            </HashRouter>
        </FavoritesProvider>
    </StrictMode>
)
