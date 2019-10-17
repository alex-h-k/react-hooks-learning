import React, { useReducer, useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

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

const httpReducer = (currentHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { isLoading: true, error: null };
    case 'RESPONSE':
      return { ...currentHttpState, isLoading: false };
    case 'ERROR':
      return { loading: false, error: action.errorMessage };
    case 'CLEAR':
      return { ...currentHttpState, error: null };
    default:
      throw new Error('shoud not be reached');
  }
};

function Ingredients() {
  const [ingredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    laoding: false,
    error: null,
  });
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

  const addIngredientHandler = ingredient => {
    // setIsLoading(true);
    dispatchHttp({ type: 'SEND' });
    fetch('https://react-hooks-update-f294b.firebaseio.com/ingredients.json', {
      method: 'Post',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => {
        // setIsLoading(false);
        dispatchHttp({ type: 'RESPONSE' });
        return response.json();
      })
      .then(responseData => {
        // setIngredients(prevIngredients => [
        //   ...prevIngredients,
        //   { id: responseData.name, ...ingredient },
        // ]);
        dispatch({
          type: 'ADD',
          ingredient: { id: responseData.name, ...ingredient },
        });
      });
  };
  const onRemoveItemHandler = id => {
    // setIsLoading(true);
    dispatchHttp({ type: 'SEND' });
    fetch(
      `https://react-hooks-update-f294b.firebaseio.com/ingredients/${id}.json`,
      {
        method: 'DELETE',
      },
    )
      .then(response => {
        // setIsLoading(false);
        dispatchHttp({ type: 'RESPONSE' });
        // setIngredients(prevIngredients =>
        //   prevIngredients.filter(ingredient => ingredient.id !== id),
        // );
        dispatch({ type: 'DELETE', id: id });
      })
      .catch(error => {
        // setError('Something went wrong!');
        // setIsLoading(false);
        dispatchHttp({ type: 'ERROR', errorMessage: '' });
      });
  };

  const clearError = () => {
    // setError(null);
    dispatchHttp({ type: 'CLEAR' });
  };

  return (
    <div className="App">
      {httpState.error && (
        <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>
      )}

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpState.isLoading}
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
