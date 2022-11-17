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
  TOGGLE_MODAL_SUCCESS,
  TOGGLE_TAGMODAL_SUCCESS,
  FETCH_TRADES_BEGIN,
  FETCH_TRADES_SUCCESS,
  FETCH_TRADES_ERROR,
  CREATE_TRADE_BEGIN,
  CREATE_TRADE_SUCCESS,
  CREATE_TRADE_ERROR,
  DELETE_TRADE_BEGIN,
  DELETE_TRADE_SUCCESS,
  DELETE_TRADE_ERROR,
  SET_SELECTED_TRADES,
  FETCH_JOURNALS_BEGIN,
  FETCH_JOURNALS_SUCCESS,
  FETCH_JOURNALS_ERROR,
  EDIT_JOURNAL_BEGIN,
  EDIT_JOURNAL_SUCCESS,
  EDIT_JOURNAL_ERROR,
  CREATE_JOURNAL_BEGIN,
  CREATE_JOURNAL_SUCCESS,
  CREATE_JOURNAL_ERROR,
  FETCH_TAGS_BEGIN,
  FETCH_TAGS_SUCCESS,
  FETCH_TAGS_ERROR,
  CREATE_TAG_BEGIN,
  CREATE_TAG_SUCCESS,
  CREATE_TAG_ERROR,
  DELETE_TAG_BEGIN,
  DELETE_TAG_SUCCESS,
  DELETE_TAG_ERROR,
  SET_SELECTED_TAGS,
  FETCH_CHARTDATA_BEGIN,
  FETCH_CHARTDATA_SUCCESS,
  FETCH_CHARTDATA_ERROR,
  CLEAR_ALERT,
} from "./actions";
import { Action } from "history";

// initial global state (used for keeping track of existence of user)
// on each re-render, get the user data and token from local storage
const initialState = {
  user: "",
  token: localStorage.getItem("token"),
  isLoading: false,
  showAlert: false,
  showMainModal: false,
  showTagModal: false,
  alertText: "",
  alertType: "",
  products: [],
  hasSubscription: false,
  trades: [],
  selectedTrades: {},
  journals: [],
  tags: [],
  selectedTags: {},
  chartData: {},
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

  // -- MODAL TOGGLE FUNCTIONS --
  const toggleMainModal = async () => {
    dispatch({ type: TOGGLE_MODAL_SUCCESS });
  };

  const toggleTagModal = async () => {
    dispatch({ type: TOGGLE_TAGMODAL_SUCCESS });
  };

  // -- TRADES FUNCTIONS --

  // get all trades
  const getTrades = async () => {
    try {
      dispatch({ type: FETCH_TRADES_BEGIN });
      // try and send request to get trades
      const { data } = await authFetch.get("trades");
      const { trades } = data;

      // set trades global state variable to the trades array from the response
      dispatch({ type: FETCH_TRADES_SUCCESS, payload: { trades } });
    } catch (error) {
      dispatch({ type: FETCH_TRADES_ERROR });
      console.log(error);
    }
  };

  // create trade
  const createTrade = async (tradeInfo, selectedTags) => {
    try {
      dispatch({ type: CREATE_TRADE_BEGIN });
      // filter the selected tags to only send the selected tag ID's which have a value of true
      const selectedTagsId = Object.entries(selectedTags)
        .filter((pair) => {
          return pair[1];
        })
        .map((pair) => {
          return pair[0];
        });

      // try and send request to create trades with trade info and given tags
      await authFetch.post("trades", { tradeInfo, selectedTagsId });

      // try and send request to create journal with the given trade date
      await authFetch.post("journals", {
        date: tradeInfo.executions[0].execDate,
        notes: "",
        method: "trade-creation",
      });

      // send get request to get all of the trades
      const { data } = await authFetch.get("trades");

      // update global state trades array variable (cause trades page to update and re-render)
      dispatch({
        type: CREATE_TRADE_SUCCESS,
        payload: { trades: data.trades },
      });

      // clear alerts
      dispatch({ type: CLEAR_ALERT }); // clear alerts
    } catch (error) {
      // if the error status code is 400 (bad request)
      if (error.response.status === 400) {
        dispatch({
          type: CREATE_TRADE_ERROR,
          payload: { text: error.response.data.msg, type: "danger" },
        });
      } else {
        // otherwise, it is probably an unauthenticated request, in which case logout the user
        logoutUser();
      }
    }
  };

  // set selectedTrades global state from tradelist table
  const setSelectedTrades = (selectedTrades) => {
    dispatch({ type: SET_SELECTED_TRADES, payload: { selectedTrades } });
  };

  // delete trade(s)
  const deleteTrade = async (tradeIdList) => {
    try {
      dispatch({ type: DELETE_TRADE_BEGIN });
      // try and send request to delete trades
      await authFetch.post("trades/delete", tradeIdList);

      // send request to get all of the trades
      const { data } = await authFetch.get("trades");

      // if the trade deletion process is successful, update the global state trades array (causing a re-render on the front end)
      dispatch({
        type: DELETE_TRADE_SUCCESS,
        payload: { trades: data.trades },
      });
      // // reload the page after trades have been deleted so that changes are reflected on the tradelist
      // document.location.reload(true);
    } catch (error) {
      console.log(error);
      dispatch({ type: DELETE_TRADE_ERROR });
    }
  };

  // -- JOURNALS FUNCTIONS --

  // get journal entries
  const getJournals = async () => {
    try {
      dispatch({ type: FETCH_JOURNALS_BEGIN });
      // send get request to get the journals
      const { data } = await authFetch.get("journals");
      const { journals } = data;

      dispatch({ type: FETCH_JOURNALS_SUCCESS, payload: { journals } });
    } catch (error) {
      dispatch({ type: FETCH_JOURNALS_ERROR });
      console.log(error);
    }
  };

  // edit journal entry
  const editJournal = async ({
    journalId,
    notes,
    height,
    screenshotFile,
    screenshotLink,
    screenshotDocKey,
  }) => {
    dispatch({ type: EDIT_JOURNAL_BEGIN });
    // try and create multipart form data and send request to backend
    try {
      const formdata = new FormData();
      formdata.append("journalId", journalId);

      // if notes exists (can be empty string, but not undefined)
      if (notes !== undefined) {
        formdata.append("notes", notes);
      }

      // if height exists
      if (height) {
        formdata.append("height", height);
      }

      // if screenshotFile exists
      if (screenshotFile) {
        formdata.append("screenshotFile", screenshotFile);
      }

      if (screenshotLink && screenshotDocKey) {
        formdata.append("screenshotLink", screenshotLink);
        formdata.append("screenshotDocKey", screenshotDocKey);
      }

      // send patch request to /journals route with multipart form data to update journals on backend
      await authFetch.patch("journals", formdata);

      // send get request to get the journals
      const { data } = await authFetch.get("journals");

      // update global state journals array
      dispatch({
        type: EDIT_JOURNAL_SUCCESS,
        payload: { journals: data.journals },
      });
    } catch (error) {
      dispatch({ type: EDIT_JOURNAL_ERROR });
      console.log(error);
    }
  };

  // create journal entry
  const createJournal = async (journalInfo) => {
    dispatch({ type: CREATE_JOURNAL_BEGIN });
    try {
      // send post request to try and create journal with given journal info
      await authFetch.post("journals", journalInfo);

      // send get request to fetch all of the journals
      const { data } = await authFetch.get("journals");

      // if journal creation is successful, update the global state journals array (cause journals page to update and re-render)
      dispatch({
        type: CREATE_JOURNAL_SUCCESS,
        payload: { journals: data.journals },
      });

      // clear alerts
      dispatch({ type: CLEAR_ALERT }); // clear alerts
    } catch (error) {
      // if there is an error, set show alert to true with given alert text
      console.log(error);
      dispatch({
        type: CREATE_JOURNAL_ERROR,
        payload: {
          type: "danger",
          text: error.response.data.msg,
        },
      });
    }
  };

  // get tags
  const fetchTags = async () => {
    try {
      dispatch({ type: FETCH_TAGS_BEGIN });
      const { data } = await authFetch.get("tags");

      dispatch({ type: FETCH_TAGS_SUCCESS, payload: { tags: data.tags } });
    } catch (error) {
      console.log(error);
      dispatch({ type: FETCH_TAGS_ERROR });
    }
  };

  // create tag
  const createTag = async (text) => {
    // try and send post request to create tag
    try {
      dispatch({ type: CREATE_TAG_BEGIN });
      await authFetch.post("tags", { text });

      // send get request to get all of the tags after adding it
      const { data } = await authFetch.get("/tags");

      // add tag to the global context tag property
      dispatch({ type: CREATE_TAG_SUCCESS, payload: { tags: data.tags } });

      // clear alerts
      dispatch({ type: CLEAR_ALERT }); // clear alerts
    } catch (error) {
      console.log(error);
      dispatch({
        type: CREATE_TAG_ERROR,
        payload: { type: "danger", text: error.response.data.msg },
      });
    }
  };

  // delete tag
  const deleteTag = async (tagId) => {
    try {
      // try and send a delete request to delete tag
      dispatch({ type: DELETE_TAG_BEGIN });
      await authFetch.delete(`tags/${tagId}`);

      // send get request to get all of the tags after adding it
      const { data: tagsData } = await authFetch.get("/tags");

      // send get request to get all of the trades
      const { data: tradesData } = await authFetch.get("/trades");

      // update global tags property
      dispatch({
        type: DELETE_TAG_SUCCESS,
        payload: { tags: tagsData.tags, trades: tradesData.trades },
      });
    } catch (error) {
      console.log(error);
      dispatch({ type: DELETE_TAG_ERROR });
    }
  };

  // set selected tag
  const setSelectedTags = async (selectedTags) => {
    dispatch({ type: SET_SELECTED_TAGS, payload: { selectedTags } });
  };

  // -- CHART TRADES DATA FUNCTIONS --
  const getChartData = async (days) => {
    try {
      dispatch({ type: FETCH_CHARTDATA_BEGIN });

      // if the user provided the number of days in the past of data
      if (days) {
        // send get request with the query parameter
        const { data: chartData } = await authFetch(
          `/trades/data?days=${days}`
        );
        dispatch({ type: FETCH_CHARTDATA_SUCCESS, payload: { chartData } });
      } else {
        // otherwise if the user did not provide the number of days
        // send get request without the query parameter
        const { data: chartData } = await authFetch("/trades/data");
        dispatch({ type: FETCH_CHARTDATA_SUCCESS, payload: { chartData } });
      }

      // update global state chartData variable
    } catch (error) {
      console.log(error);
      dispatch({ type: FETCH_CHARTDATA_ERROR });
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
        toggleMainModal,
        toggleTagModal,
        getTrades,
        createTrade,
        deleteTrade,
        clearAlert,
        setSelectedTrades,
        getJournals,
        editJournal,
        createJournal,
        fetchTags,
        createTag,
        deleteTag,
        setSelectedTags,
        getChartData,
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
