import { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";

import reducer from "./reducer";

import {
  REGISTER_USER_BEGIN,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
  LOGIN_USER_BEGIN,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  FETCH_USER_BEGIN,
  FETCH_USER_SUCCESS,
  FETCH_USER_ERROR,
  LOGOUT_USER,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  CHANGE_PASSWORD_BEGIN,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_ERROR,
  FETCH_PRODUCTS_BEGIN,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_ERROR,
  CREATE_SESSION_BEGIN,
  CREATE_SESSION_SUCCESS,
  CREATE_SESSION_ERROR,
  SET_SUBSCRIPTION_BEGIN,
  SET_SUBSCRIPTION_SUCCESS,
  SET_SUBSCRIPTION_ERROR,
  CLEAR_ALERT,
} from "./actions";

// initial global state (used for keeping track of existence of user)
// on each re-render, get the user data and token from local storage
const initialState = {
  user: "",
  token: localStorage.getItem("token"),
  isLoading: false,
  showAlert: false,
  alertText: "",
  alertType: "",
  products: [],
  hasSubscription: false,
};

// try and parse the user object in the local storage and set the initial state user object to the user object in local storage
try {
  const user = JSON.parse(localStorage.getItem("user"));
  initialState.user = user;
} catch (error) {}

// create a context
const AppContext = createContext();

// create app context provider component
function AppContextProvider({ children }) {
  // -- GLOBAL STATE --
  // use reducer to manage state changes
  const [state, dispatch] = useReducer(reducer, initialState);

  // -- CUSTOM AUTHENTICATION AXIOS --
  // create instance of axios with custom config for accessing protected routes
  const authFetch = axios.create({
    baseURL: "/api/v1",
  });

  // interceptors for custom axios for making requests to protected routes
  // request interceptor
  authFetch.interceptors.request.use(
    (config) => {
      // add request authorization header to the request config
      config.headers["Authorization"] = `Bearer ${state.token}`;
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

  // -- USER FUNCTIONS --
  // function for registering the user
  const registerUser = async (userInfo) => {
    // set isLoading state to true, which disable's submit button
    dispatch({ type: REGISTER_USER_BEGIN });
    try {
      // try and get response from register request
      const registerResponse = await axios.post(
        "/api/v1/auth/register",
        userInfo
      );

      const { user, token } = registerResponse.data;

      // get the priceId from the first product in global state products array
      const { priceId } = state.products[0];

      // get the customerId from the user object
      const { customerId } = user;

      // try and create a trial subscription for this user
      await axios.post("/api/v1/stripe/subscription", { priceId, customerId });

      // update alert state to success, store user info in global state, and set isLoading to false
      dispatch({
        type: REGISTER_USER_SUCCESS,
        payload: {
          user,
          token,
        },
      });
      // add token and user info (stringified) to local storage
      addUserToLocalStorage({ user: JSON.stringify(user), token });

      // clear any alerts
      clearAlert();
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

      console.log(user);

      // update alert state to success, store user info in global state, and set isLoading to false
      dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: {
          user,
          token,
        },
      });
      // add token and user info (stringified) to local storage
      addUserToLocalStorage({ user: JSON.stringify(user), token });

      // clear any alerts
      clearAlert();
    } catch (error) {
      // set alert state to true, danger, and display message from response
      dispatch({
        type: LOGIN_USER_ERROR,
        payload: { text: error.response.data.msg, type: "danger" },
      });
    }
  };

  // function for fetching the user from the server (for authentication of protected routes)
  // this function is only executed on the first render of any protected route

  const fetchUser = async () => {
    // Set is loading to true
    dispatch({ type: FETCH_USER_BEGIN });

    // try and fetch user from protected route with the token from the state (provided in request interceptor)
    try {
      const { data: user } = await authFetch.get("/me");

      // set user global state variable to the data received from the response
      dispatch({
        type: FETCH_USER_SUCCESS,
        payload: { user },
      });

      // store user information (stringified) in local storage
      addUserToLocalStorage({ user: JSON.stringify(user), token: state.token });
    } catch (error) {
      // if fetching the user with the token in the state (from local storage on renders) fails

      // set is loading to false
      dispatch({ type: FETCH_USER_ERROR });

      // logout the user by clearing the local storage, and setting state variables back to defaults
      logoutUser();
    }
  };

  // logout user
  const logoutUser = () => {
    removeUserFromLocalStorage();
    dispatch({ type: LOGOUT_USER });
  };

  // update user function
  const updateUser = async (userInfo, profilePictureFile) => {
    // set isLoading to true
    dispatch({ type: UPDATE_USER_BEGIN });

    try {
      // try and stringify userInfo
      const userInfoJsonString = JSON.stringify(userInfo);

      // create multipart form data
      const formData = new FormData();

      // append stringified userInfo json and profile picture file to multipart form data
      formData.append("userInfo", userInfoJsonString);
      formData.append("file", profilePictureFile);

      // send patch request to /updateUser endpoint with multipart form data
      const response = await authFetch.patch("/auth/updateUser", formData);

      // get user object and token from response
      const { user, token, msg } = response.data;

      // update global state variables to be the new user information, and new token
      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: { user, token, text: msg, type: "success" },
      });

      // add new user (stringified) and token to local storage
      addUserToLocalStorage({ user: JSON.stringify(user), token });
    } catch (error) {
      // if there is an internal server error, log the user out
      if (error.response.status === 500) {
        logoutUser();
        return;
      }

      // otherwise
      // set is Loading to false, set show alert to true, and set alert text and type to danger
      dispatch({
        type: UPDATE_USER_ERROR,
        payload: { text: error.response.data.msg, type: "danger" },
      });
    }
  };

  // change password function
  const changePassword = async (passwordInfo) => {
    dispatch({ type: CHANGE_PASSWORD_BEGIN });

    try {
      const response = await authFetch.patch(
        "/auth/changePassword",
        passwordInfo
      );

      dispatch({
        type: CHANGE_PASSWORD_SUCCESS,
        payload: { text: response.data.msg, type: "success" },
      });
      console.log(response);
    } catch (error) {
      dispatch({
        type: CHANGE_PASSWORD_ERROR,
        payload: { text: error.response.data.msg, type: "danger" },
      });
    }
  };

  // -- STRIPE FUNCTIONS --
  // fetch products function
  const fetchProducts = async () => {
    // set isLoading to true
    dispatch({ type: FETCH_PRODUCTS_BEGIN });

    // try and get data from response of request to stripe API
    try {
      const { data } = await axios.get("products", {
        baseURL: "/api/v1/stripe",
      });

      // set local state products variable to the products array from response
      dispatch({
        type: FETCH_PRODUCTS_SUCCESS,
        payload: { products: data },
      });
    } catch (error) {
      dispatch({ type: FETCH_PRODUCTS_ERROR });
    }
  };

  // create session
  const createSession = async (priceId) => {
    // set isLoading to true
    dispatch({ type: CREATE_SESSION_BEGIN });

    // try and create a stripe session
    try {
      const { data } = await authFetch.post("stripe/session", { priceId });

      // if the user is already subscribed, show alert informing user that they are already subscribed, and set isLoading to false
      if (data.subscribed) {
        dispatch({ type: CREATE_SESSION_ERROR, payload: { text: data.msg } });
      } else {
        // otherwise navigate user to the stripe checkout session
        dispatch({ type: CREATE_SESSION_SUCCESS });
        // navigate user to session success url once request has been fulfilled
        window.location.href = data.session.url;
      }
    } catch (error) {
      // set isLoading to false
      dispatch({ type: CREATE_SESSION_ERROR });
      console.log(error);
    }
  };

  // get subscription (also fetches user)
  const getSubscriptions = async () => {
    // set isLoading to true
    dispatch({ type: SET_SUBSCRIPTION_BEGIN });

    // try and fetch user and subscription
    try {
      // fetch user
      const { data: user } = await authFetch.get("/me");

      // fetch subscriptions
      const subscriptions = await authFetch.get("stripe/subscription");

      // if the user has subscriptions (length is greater than 0)
      if (subscriptions.data.length) {
        // set is loading to false, update user, and set has subscription flag to true
        dispatch({
          type: SET_SUBSCRIPTION_SUCCESS,
          payload: { user },
        });
      } else {
        // otherwise set is loading to false, update user, and set has subscription flag to false
        dispatch({
          type: SET_SUBSCRIPTION_ERROR,
          payload: { user },
        });
      }

      // store user information (stringified) in local storage
      addUserToLocalStorage({ user: JSON.stringify(user), token: state.token });
    } catch (error) {
      // if either of these requests fail, logout the user
      logoutUser();
    }
  };

  // -- MISC FUNCTIONS --

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
  const removeUserFromLocalStorage = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // add product info to local storage
  const addProductToLocalStorage = (product) => {
    localStorage.setItem("productPrice", product.price / 100);
    localStorage.setItem("productName", product.name);
  };

  // return app context provider component, passing in functions and state values to all child components in application
  return (
    <AppContext.Provider
      value={{
        ...state,
        registerUser,
        loginUser,
        fetchUser,
        logoutUser,
        updateUser,
        changePassword,
        fetchProducts,
        createSession,
        getSubscriptions,
        clearAlert,
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
