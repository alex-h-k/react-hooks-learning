import React, { useContext } from 'react';
import Auth from './components/Auth';
import { AuthContext } from './context/auth-context';
import Ingredients from './components/Ingredients/Ingredients';

const App = props => {
  const authContext = useContext(AuthContext);
  // console.log(authContext);
  let content = <Auth />;
  if (authContext.isAuth) {
    content = <Ingredients />;
  }
  return content;

  // return authContext.isAuth ? <Ingredients /> : <Auth />;
};

export default App;
