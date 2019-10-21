import React, { useReducer, useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ig => ig.id !== action.id);
    default:
      throw new Error('not going to happen!');
  }
};

function Ingredients() {
  const [ingredients, dispatch] = useReducer(ingredientReducer, []);
  const { isLoading, data, error, sendRequest } = useHttp();
  // const [ingredients, setIngredients] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

  useEffect(() => {
    console.log('rendering ingredients', ingredients);
  });

  const filteredIngredientsHandler = useCallback(filteredIngredient => {
    // setIngredients(filteredIngredient);
    dispatch({ type: 'SET', ingredients: filteredIngredient });
  }, []);

  const addIngredientHandler = useCallback(ingredient => {
    // setIsLoading(true);
    // dispatchHttp({ type: 'SEND' });
    // fetch('https://react-hooks-update-f294b.firebaseio.com/ingredients.json', {
    //   method: 'Post',
    //   body: JSON.stringify(ingredient),
    //   headers: { 'Content-Type': 'application/json' },
    // })
    //   .then(response => {
    //     // setIsLoading(false);
    //     dispatchHttp({ type: 'RESPONSE' });
    //     return response.json();
    //   })
    //   .then(responseData => {
    //     // setIngredients(prevIngredients => [
    //     //   ...prevIngredients,
    //     //   { id: responseData.name, ...ingredient },
    //     // ]);
    //     dispatch({
    //       type: 'ADD',
    //       ingredient: { id: responseData.name, ...ingredient },
    //     });
    //   });
  }, []);
  const onRemoveItemHandler = useCallback(
    id => {
      // setIsLoading(true);
      // dispatchHttp({ type: 'SEND' });
      sendRequest(
        `https://react-hooks-update-f294b.firebaseio.com/ingredients/${id}.json`,
        'DELETE',
      );
    },
    [sendRequest],
  );

  const clearError = () => {
    // setError(null);
    // dispatchHttp({ type: 'CLEAR' });
  };

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList
          ingredients={ingredients}
          onRemoveItem={onRemoveItemHandler}
        />
      </section>
    </div>
  );
}

export default Ingredients;
