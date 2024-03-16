import "./App.css";
import {FormEvent, useEffect, useRef, useState} from "react";
import * as api from "./api";
import {Recipe} from "./types.ts";
import RecipeCard from "./components/RecipeCard.tsx";
import RecipeModal from "./components/RecipeModal.tsx";
import {AiOutlineSearch} from "react-icons/ai";

type Tabs = "search" | "favorites";

const App = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | undefined>(undefined);
    const [selectedTab, setSelectedTab] = useState<Tabs>("search");
    const [favouriteRecipes, setFavouriteRecipes] = useState<Recipe[]>([]);
    const pageNumber = useRef(1);


    useEffect(() => {
      const fetchFavouriteRecipes = async () => {
          try{
              const favouriteRecipes = await api.getFavouriteRecipes();
              setFavouriteRecipes(favouriteRecipes.results)
          } catch (e){
            console.log(e);
          }
      };

      fetchFavouriteRecipes();
    }, [])

    const handleSearchSubmit = async (event: FormEvent) => {
        event.preventDefault()
        try{
            const recipes = await api.searchRecipes(searchTerm, 1);
            setRecipes(recipes.results);
            pageNumber.current = 1;
        } catch (e){
          console.log(e);
        }
    }

    const handleViewMoreClick = async () => {
        const nextPageNumber = pageNumber.current + 1;
        try{
            const nextRecipes = await api.searchRecipes(searchTerm, nextPageNumber);
            setRecipes(recipes.concat(nextRecipes.results));
            pageNumber.current = nextPageNumber;
        } catch (e){
          console.log(e);
        }
    }

    const addFavouriteRecipe = async (recipe: Recipe) => {
        try{
            await api.addFavouriteRecipe(recipe);
            setFavouriteRecipes(favouriteRecipes.concat(recipe));
        } catch (e){
          console.log(e);
        }
    }

    const removeFavouriteRecipe = async (recipe: Recipe) => {
        try{
            await api.removeFavouriteRecipe(recipe);
            const updatedRecipes = favouriteRecipes.filter((favouriteRecipe) => favouriteRecipe.id !== recipe.id);
            setFavouriteRecipes(updatedRecipes);
        } catch (e){
          console.log(e);
        }
    }


    return (
        <div className='app-container'>
            <div className="header">
                <img src='/hero-image.jpg'/>
                <div className='title'>My Recipe App</div>
            </div>
            <div className="tabs">
                <h1 className={selectedTab === "search" ? "tab-active" : ""}
                    onClick={() => setSelectedTab("search")}> Recipe Search </h1>
                <h1 className={selectedTab === "favorites" ? "tab-active" : ""}
                    onClick={() => setSelectedTab("favorites")}> Favourites </h1>
            </div>
            {selectedTab === "search" && (<>
                <form onSubmit={(event)=> handleSearchSubmit(event)}>
                    <input
                        type="text"
                        required
                        placeholder="Search for recipes"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                    ></input>
                    <button type="submit"><AiOutlineSearch size={40}/></button>
                </form>

                <div className="recipe-grid">
                {recipes.map((recipe) => {
                    const isFavourite = favouriteRecipes.some(
                        (favouriteRecipe) => recipe.id === favouriteRecipe.id
                    );


                    return (
                        <RecipeCard
                            recipe={recipe}
                            onClick={() => setSelectedRecipe(recipe)}
                            onFavouriteButtonClick={isFavourite ? removeFavouriteRecipe : addFavouriteRecipe }
                            isFavourite={isFavourite}
                        />
                    );
                })}
                </div>
                <button
                    className="view-more-button" onClick={handleViewMoreClick}
                >View More</button>
            </>)}

            {selectedTab === "favorites" && (
                <div className="recipe-grid">
                    {favouriteRecipes.map((recipe) => (
                        <RecipeCard
                            recipe={recipe}
                            onClick={() => setSelectedRecipe(recipe)}
                            onFavouriteButtonClick={removeFavouriteRecipe}
                            isFavourite={true}
                        />
                    ))}
                </div>
            )}

            {selectedRecipe ? <RecipeModal
                recipeId={selectedRecipe.id.toString()}
                onClose={() => setSelectedRecipe(undefined)}
            /> : null}
        </div>
    );
}

export default App;