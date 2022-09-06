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

import { initialState } from "./appContext";

const reducer = (state, action) => {
  // -- REGISTER --
  if (action.type === REGISTER_USER_BEGIN) {
    return { ...state, isLoading: true };
  }
  if (action.type === REGISTER_USER_SUCCESS) {
    console.log("register");
    return {
      ...state,
      isLoading: false,
      user: action.payload.user,
      token: action.payload.token,
      hasSubscription: true,
    };
  }
  if (action.type === REGISTER_USER_ERROR) {
    console.log("register error");
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertText: action.payload.text,
      alertType: action.payload.type,
    };
  }

  // -- LOGIN --
  if (action.type === LOGIN_USER_BEGIN) {
    return { ...state, isLoading: true };
  }
  if (action.type === LOGIN_USER_SUCCESS) {
    console.log("login");
    return {
      ...state,
      isLoading: false,
      user: action.payload.user,
      token: action.payload.token,
    };
  }
  if (action.type === LOGIN_USER_ERROR) {
    console.log("login error");
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertText: action.payload.text,
      alertType: action.payload.type,
    };
  }

  // -- FETCH USER --
  if (action.type === FETCH_USER_BEGIN) {
    console.log("fetch user begin");
    return {
      ...state,
      isLoading: true,
    };
  }

  if (action.type === FETCH_USER_SUCCESS) {
    console.log("fetch user success");
    return {
      ...state,
      isLoading: false,
      user: action.payload.user,
    };
  }

  if (action.type === FETCH_USER_ERROR) {
    console.log("fetch user error");
    return {
      ...state,
      isLoading: false,
    };
  }

  // -- LOGOUT USER --
  if (action.type === LOGOUT_USER) {
    console.log("logout user");
    return {
      ...initialState,
      user: null,
      token: null,
    };
  }

  // -- UPDATE USER --
  if (action.type === UPDATE_USER_BEGIN) {
    console.log("update user begin");
    return {
      ...state,
      isLoading: true,
    };
  }
  if (action.type === UPDATE_USER_SUCCESS) {
    console.log("update user success");
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertText: action.payload.text,
      alertType: action.payload.type,
      user: action.payload.user,
      token: action.payload.token,
    };
  }
  if (action.type === UPDATE_USER_ERROR) {
    console.log("update user error");
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertText: action.payload.text,
      alertType: action.payload.type,
    };
  }

  // -- CHANGE PASSWORD --
  if (action.type === CHANGE_PASSWORD_BEGIN) {
    console.log("change password begin");
    return {
      ...state,
      isLoading: true,
    };
  }
  if (action.type === CHANGE_PASSWORD_SUCCESS) {
    console.log("change password success");
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertText: action.payload.text,
      alertType: action.payload.type,
    };
  }
  if (action.type === CHANGE_PASSWORD_ERROR) {
    console.log("change password error");
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertText: action.payload.text,
      alertType: action.payload.type,
    };
  }

  // -- FETCH PRODUCTS --
  if (action.type === FETCH_PRODUCTS_BEGIN) {
    console.log("fetch products begin");
    return {
      ...state,
      isLoading: true,
    };
  }

  if (action.type === FETCH_PRODUCTS_SUCCESS) {
    console.log("fetch products success");
    return {
      ...state,
      isLoading: false,
      products: action.payload.products,
    };
  }

  if (action.type === FETCH_PRODUCTS_ERROR) {
    console.log("fetch products error");
    return {
      ...state,
      isLoading: false,
    };
  }

  // -- CLEAR ALERT --
  if (action.type === CLEAR_ALERT) {
    console.log("clear alert");
    return {
      ...state,
      showAlert: false,
      alertText: "",
      alertType: "",
    };
  }

  // -- CREATE SESSION --
  if (action.type === CREATE_SESSION_BEGIN) {
    console.log("create session begin");
    return {
      ...state,
      isLoading: true,
    };
  }

  if (action.type === CREATE_SESSION_SUCCESS) {
    console.log("create session success");
    return {
      ...state,
      isLoading: false,
    };
  }

  if (action.type === CREATE_SESSION_ERROR) {
    console.log("create session error");
    return {
      ...state,
      showAlert: true,
      alertType: "success",
      alertText: action.payload.text,
      isLoading: false,
    };
  }

  // -- SET SUBSCRIPTION STATUS --
  if (action.type === SET_SUBSCRIPTION_BEGIN) {
    console.log("fetch user and set subscription begin");
    return {
      ...state,
      isLoading: true,
    };
  }

  if (action.type === SET_SUBSCRIPTION_SUCCESS) {
    console.log("fetch user and set subscription success");
    return {
      ...state,
      isLoading: false,
      hasSubscription: true,
      user: action.payload.user,
    };
  }

  if (action.type === SET_SUBSCRIPTION_ERROR) {
    console.log("fetch user and set subscription error");
    return {
      ...state,
      isLoading: false,
      hasSubscription: false,
      user: action.payload.user,
    };
  }

  throw new Error(`no such action : ${action.type}`);
};

export default reducer;
