import { useReducer, useCallback } from 'react';

const initialState = {
  isLaoding: false,
  error: null,
  data: null,
  extra: null,
  indentifier: null,
};

const httpReducer = (currentHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return {
        isLoading: true,
        error: null,
        data: null,
        extra: null,
        identifer: action.identifer,
      };
    case 'RESPONSE':
      return {
        ...currentHttpState,
        isLoading: false,
        data: action.responseData,
        extra: action.extra,
      };
    case 'ERROR':
      return { loading: false, error: action.errorMessage };
    case 'CLEAR':
      return initialState;
    default:
      throw new Error('shoud not be reached');
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

  const clear = useCallback(() => {
    dispatchHttp({ type: 'CLEAR' });
  });

  const sendRequest = useCallback(
    (url, method, body, reqExtra, reqIdentifer) => {
      dispatchHttp({ type: 'SEND', identifer: reqIdentifer });
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
          dispatchHttp({
            type: 'RESPONSE',
            responseData: responseData,
            extra: reqExtra,
          });
        })
        .catch(error => {
          // setError('Something went wrong!');
          // setIsLoading(false);
          dispatchHttp({ type: 'ERROR', errorMessage: 'Something went wrong' });
        });
    },
    [],
  );
  return {
    isLoading: httpState.isLoading,
    data: httpState.data,
    error: httpState.error,
    sendRequest: sendRequest,
    reqExtra: httpState.extra,
    reqIdentifer: httpState.identifer,
    clear: clear,
  };
};

export default useHttp;
