import { createContext, useContext, useReducer } from "react";
import axios from "axios";

import reducer from "./reducer";

import { REGISTER_USER_SUCCESS, LOGIN_USER_SUCCESS } from "./actions";

// initial global state (used for keeping track of existence of user)
const initialState = {
  user: null,
  token: "",
};

// create a context
const AppContext = createContext();

// create app context provider component
function AppContextProvider({ children }) {
  // use reducer to manage state changes
  const [state, dispatch] = useReducer(reducer, initialState);

  // function for registering the user
  const registerUser = async (userInfo) => {
    try {
      // try and get response from register request
      const response = await axios.post("/api/v1/auth/register", userInfo);

      const { user, token } = response.data;

      dispatch({ type: REGISTER_USER_SUCCESS, payload: { user, token } });
    } catch (error) {
      console.log(error.response.data.msg);
    }
  };

  // function for logging in the user
  const loginUser = async (userInfo) => {
    try {
      // try and get response of login request
      const response = await axios.post("/api/v1/auth/login", userInfo);

      const { user, token } = response.data;

      dispatch({ type: LOGIN_USER_SUCCESS, payload: { user, token } });
    } catch (error) {
      console.log(error.response.data.msg);
    }
  };

  // return app context provider component, passing in functions and state values to all child components in application
  return (
    <AppContext.Provider value={{ registerUser, loginUser }}>
      {children}
    </AppContext.Provider>
  );
}

// create function that uses the useContext hook
function useAppContext() {
  return useContext(AppContext);
}

export { AppContextProvider, useAppContext };
