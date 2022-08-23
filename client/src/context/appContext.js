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
  FETCH_USER_BEGIN,
  FETCH_USER_SUCCESS,
  FETCH_USER_ERROR,
  LOGOUT_USER,
} from "./actions";

// initial global state (used for keeping track of existence of user)
// on each re-render, get the user data and token from local storage
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

  // create instance of axios with custom config for accessing protected routes
  const authFetch = axios.create({
    baseURL: "/api/v1",
  });

  // interceptors for custom axios for making requests to protected routes
  // request interceptor
  authFetch.interceptors.request.use(
    (config) => {
      // add request authorization header to the request config
      config.headers.common["Authorization"] = `Bearer ${state.token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // response interceptor
  authFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // if the response from the request is a 401 error
      return Promise.reject(error);
    }
  );

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
        },
      });
      // add token and user info to local storage
      addUserToLocalStorage({ user, token });
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
        },
      });
      // add token and user info to local storage
      addUserToLocalStorage({ user, token });
    } catch (error) {
      // set alert state to true, danger, and display message from response
      dispatch({
        type: LOGIN_USER_ERROR,
        payload: { text: error.response.data.msg, type: "danger" },
      });
    }
  };

  // function for fetching the user from the server (for authentication of protected routes)

  const fetchUser = async () => {
    // Set is loading to true
    dispatch({ type: FETCH_USER_BEGIN });

    // try and fetch user from protected route with the token from the state (provided in request interceptor)
    try {
      const { data } = await authFetch.get("/me");

      // extract relevant user information from response
      const userInfo = {
        user: {
          userId: data._id,
          username: data.username,
          email: data.email,
        },
        token: state.token,
      };

      // set user global state variable to the data received from the response
      dispatch({ type: FETCH_USER_SUCCESS, payload: { userInfo } });

      // store user information in local storage
      addUserToLocalStorage(userInfo);
    } catch (error) {
      // if fetching the user with the token in the state (from local storage on renders) fails

      // set is loading to false
      dispatch({ type: FETCH_USER_ERROR });

      // logout the user by clearing the local storage, and setting state variables back to defaults
      logoutUser();
    }
  };

  // clear alert function
  const clearAlert = () => {
    dispatch({ type: CLEAR_ALERT });
  };

  // logout user
  const logoutUser = () => {
    removeUserFromLocalStorage();
    dispatch({ type: LOGOUT_USER });
  };

  // add user information to local storage
  const addUserToLocalStorage = (userInfo) => {
    localStorage.setItem("token", userInfo.token);
    localStorage.setItem("user", userInfo.user);
  };

  // delete user information from local storage
  const removeUserFromLocalStorage = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // return app context provider component, passing in functions and state values to all child components in application
  return (
    <AppContext.Provider
      value={{
        ...state,
        registerUser,
        loginUser,
        fetchUser,
        clearAlert,
        logoutUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// create function that uses the useContext hook
function useAppContext() {
  return useContext(AppContext);
}

export { initialState, AppContextProvider, useAppContext };
