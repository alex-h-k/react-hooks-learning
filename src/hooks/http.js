import { useReducer, useCallback } from 'react';

const httpReducer = (currentHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { isLoading: true, error: null };
    case 'RESPONSE':
      return {
        ...currentHttpState,
        isLoading: false,
        data: action.responseData,
      };
    case 'ERROR':
      return { loading: false, error: action.errorMessage };
    case 'CLEAR':
      return { ...currentHttpState, error: null };
    default:
      throw new Error('shoud not be reached');
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    laoding: false,
    error: null,
    data: null,
  });

  const sendRequest = useCallback((url, method, body) => {
    dispatchHttp({ type: 'SEND' });
    fetch(url, {
      method: method,
      body: body,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        return response.json();
        // setIsLoading(false);
        // setIngredients(prevIngredients =>
        //   prevIngredients.filter(ingredient => ingredient.id !== id),
        // );
      })
      .then(responseData => {
        dispatchHttp({ type: 'RESPONSE', reponseData: responseData });
      })
      .catch(error => {
        // setError('Something went wrong!');
        // setIsLoading(false);
        dispatchHttp({ type: 'ERROR', errorMessage: 'Something went wrong' });
      });
  }, []);
  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    sendRequest: sendRequest,
  };
};

export default useHttp;
