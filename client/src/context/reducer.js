import {
  REGISTER_USER_BEGIN,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
  LOGIN_USER_BEGIN,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  CLEAR_ALERT,
} from "./actions";

const reducer = (state, action) => {
  if (action.type === REGISTER_USER_BEGIN) {
    return { ...state, isLoading: true };
  }
  if (action.type === REGISTER_USER_SUCCESS) {
    console.log("register");
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
  if (action.type === LOGIN_USER_BEGIN) {
    return { ...state, isLoading: true };
  }
  if (action.type === LOGIN_USER_SUCCESS) {
    console.log("login");
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
