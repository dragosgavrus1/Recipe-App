import {Recipe} from "../types.ts";
import {AiFillHeart, AiOutlineHeart} from "react-icons/ai";

interface Props {
    recipe: Recipe;
    isFavourite : boolean;
    onClick: () => void;
    onFavouriteButtonClick: (recipe: Recipe) => void;
}

const RecipeCard = ({recipe, onClick, onFavouriteButtonClick, isFavourite}: Props) => {
    return (
        <div className='recipe-card' onClick={onClick}>
            <img src={recipe.image} alt="recipe"></img>
            <div className='recipe-card-title'>
                <span onClick={(event)=>{
                    event.stopPropagation()
                    onFavouriteButtonClick(recipe)
                }}>
                    {isFavourite ? <AiFillHeart size={25} color="red"/> : <AiOutlineHeart size={25}/>}

                </span>
                {recipe.title}</div>
        </div>
    );
}

export default RecipeCard;