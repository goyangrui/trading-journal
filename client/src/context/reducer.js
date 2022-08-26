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
      token: action.payload.token,
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
    };
  }
  if (action.type === CHANGE_PASSWORD_SUCCESS) {
    console.log("change password success");
    return {
      ...state,
    };
  }
  if (action.type === CHANGE_PASSWORD_ERROR) {
    console.log("change password error");
    return {
      ...state,
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

  throw new Error(`no such action : ${action.type}`);
};

export default reducer;
