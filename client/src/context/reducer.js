import { REGISTER_USER_SUCCESS, LOGIN_USER_SUCCESS } from "./actions";

const reducer = (state, action) => {
  if (action.type === REGISTER_USER_SUCCESS) {
    console.log("register");
    return {
      ...state,
      user: action.payload.user,
      token: action.payload.token,
    };
  }
  if (action.type === LOGIN_USER_SUCCESS) {
    console.log("login");
    return {
      ...state,
      user: action.payload.user,
      token: action.payload.token,
    };
  }
  throw new Error(`no such action : ${action.type}`);
};

export default reducer;
