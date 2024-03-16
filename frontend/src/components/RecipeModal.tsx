import {useEffect, useState} from "react";
import {RecipeSummary} from "../types.ts";
import * as RecipeApi from "../api.ts";

interface Props {
    recipeId: string;
    onClose: () => void;
}

const RecipeModal = ({recipeId, onClose} : Props) => {

    const [recipeSummary, setRecipeSummary] = useState<RecipeSummary>();

    useEffect(() => {
      const fetchRecipeSummary = async () => {
          try{
              const summaryRecipe = await RecipeApi.getRecipeSummary(recipeId);
              setRecipeSummary(summaryRecipe);
          } catch (e){
              console.log(e);
          }
      }

      fetchRecipeSummary()
    },[recipeId]);

    if(!recipeSummary){
        return <></>;
    }

    return(
        <>
            <div className='overlay'></div>
            <div className='modal'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <h2>{recipeSummary.title}</h2>
                        <span className='close-button' onClick={onClose}>&times;</span>
                    </div>
                    <p dangerouslySetInnerHTML={{__html: recipeSummary.summary}}></p>
                </div>
            </div>
        </>
    )
}

export default RecipeModal;