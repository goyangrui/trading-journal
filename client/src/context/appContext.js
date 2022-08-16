import { createContext, useContext, useReducer } from "react";
import axios from "axios";

import reducer from "./reducer";

import {
  REGISTER_USER_BEGIN,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
  LOGIN_USER_BEGIN,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  CLEAR_ALERT,
} from "./actions";

// initial global state (used for keeping track of existence of user)
const initialState = {
  user: localStorage.getItem("user"),
  token: localStorage.getItem("token"),
  isLoading: false,
  showAlert: false,
  alertText: "",
  alertType: "",
};

// create a context
const AppContext = createContext();

// create app context provider component
function AppContextProvider({ children }) {
  // -- GLOBAL STATE --
  // use reducer to manage state changes
  const [state, dispatch] = useReducer(reducer, initialState);

  // -- GLOBAL FUNCTIONS --
  // function for registering the user
  const registerUser = async (userInfo) => {
    // set isLoading state to true, which disable's submit button
    dispatch({ type: REGISTER_USER_BEGIN });
    try {
      // try and get response from register request
      const response = await axios.post("/api/v1/auth/register", userInfo);

      const { user, token } = response.data;

      // update alert state to success, store user info in global state, and set isLoading to false
      dispatch({
        type: REGISTER_USER_SUCCESS,
        payload: {
          user,
          token,
          text: "Registration successful!",
          type: "success",
        },
      });
      // add token and user info to local storage
      addUserToLocalStorage({ user, token });

      // redirect user to dashboard
    } catch (error) {
      // set alert state to true, danger, and display message from response
      dispatch({
        type: REGISTER_USER_ERROR,
        payload: { text: error.response.data.msg, type: "danger" },
      });
    }
  };

  // function for logging in the user
  const loginUser = async (userInfo) => {
    // set isLoading state to true, which disable's submit button
    dispatch({ type: LOGIN_USER_BEGIN });
    try {
      // try and get response of login request
      const response = await axios.post("/api/v1/auth/login", userInfo);

      const { user, token } = response.data;

      // update alert state to success, store user info in global state, and set isLoading to false
      dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: {
          user,
          token,
          text: "Login successful!",
          type: "success",
        },
      });
      // add token and user info to local storage
      addUserToLocalStorage({ user, token });

      // redirect user to dashboard
    } catch (error) {
      // set alert state to true, danger, and display message from response
      dispatch({
        type: LOGIN_USER_ERROR,
        payload: { text: error.response.data.msg, type: "danger" },
      });
    }
  };

  // clear alert function
  const clearAlert = () => {
    dispatch({ type: CLEAR_ALERT });
  };

  // add user information to local storage
  const addUserToLocalStorage = (userInfo) => {
    localStorage.setItem("token", userInfo.token);
    localStorage.setItem("user", userInfo.user);
  };

  // delete user information from local storage
  const removeUserFromLocalStorage = (userInfo) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // return app context provider component, passing in functions and state values to all child components in application
  return (
    <AppContext.Provider
      value={{ ...state, registerUser, loginUser, clearAlert }}
    >
      {children}
    </AppContext.Provider>
  );
}

// create function that uses the useContext hook
function useAppContext() {
  return useContext(AppContext);
}

export { AppContextProvider, useAppContext };
