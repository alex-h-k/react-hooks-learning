import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';

function Ingredients() {
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('rendering ingredients', ingredients);
  });

  const filteredIngredientsHandler = useCallback(filteredIngredient => {
    setIngredients(filteredIngredient);
  }, []);

  const addIngredientHandler = ingredient => {
    setIsLoading(true);
    fetch('https://react-hooks-update-f294b.firebaseio.com/ingredients.json', {
      method: 'Post',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => {
        setIsLoading(false);
        return response.json();
      })
      .then(responseData => {
        setIngredients(prevIngredients => [
          ...prevIngredients,
          { id: responseData.name, ...ingredient },
        ]);
      });
  };
  const onRemoveItemHandler = id => {
    fetch(
      'https://react-hooks-update-f294b.firebaseio.com/ingredients/${id}.json',
      {
        method: 'DELETE',
      },
    ).then(response => {
      setIngredients(prevIngredients =>
        prevIngredients.filter(ingredient => ingredient.id !== id),
      );
    });
  };
  return (
    <div className="App">
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
