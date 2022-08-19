import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Wrapper from "../assets/wrappers/Register";

import { useAppContext } from "../context/appContext";
import { FormRow } from "../components";

// initial local state
const initialState = {
  email: "",
  password: "",
};

function Login() {
  // -- STATES AND HOOKS --

  // local state
  const [values, setValues] = useState(initialState);

  // get state and functions from global context
  const {
    user,
    isLoading,
    showAlert,
    alertText,
    alertType,
    loginUser,
    clearAlert,
  } = useAppContext();

  // useNavigate router-dom hook
  const navigate = useNavigate();

  // useEffect
  useEffect(() => {
    // on initial render of login page, clear any alerts
    clearAlert();
  }, []);

  useEffect(() => {
    // whenever user changes or user navigates to login/register, if user exists, redirect user to dashboard/app page
    // replace login/register route with the current route, so hitting the back button will re-route the user to the page before the login/register route
    if (user) {
      navigate("/app", { replace: true });
    }
  }, [navigate, user]);

  // -- FUNCTIONS --

  // handle on change event for updating state values
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  // handle submit function
  const handleSubmit = (e) => {
    e.preventDefault();
    // call login user global context function passing in user inputed information
    const { email, password } = values;
    loginUser({ email, password });
  };

  return (
    <Wrapper>
      <div className="container">
        {/* form */}
        <form className="form" onSubmit={handleSubmit}>
          {/* title */}
          <h2>login form</h2>

          {/* alert */}
          {showAlert && (
            <div className={`alert alert-${alertType}`}>
              {/* if user doesn't exist (failed to authenticate), show heading 5 */}
              {!user && (
                <h5>
                  {`The form contains ${alertText.split(",").length} error${
                    alertText.split(",").length > 1 ? "s" : ""
                  }`}
                </h5>
              )}
              {/* return unordered list of alert text message(s) */}
              <ul>
                {alertText.split(",").map((item, index) => {
                  return <li key={index}>{item}</li>;
                })}
              </ul>
            </div>
          )}

          {/* email */}
          <FormRow
            name="email"
            type="email"
            value={values.email}
            handleChange={handleChange}
          />

          {/* password */}
          <FormRow
            name="password"
            type="password"
            value={values.password}
            handleChange={handleChange}
          />

          {/* submit button */}
          <button type="submit" className="btn btn-block" disabled={isLoading}>
            Login
          </button>
          <p>
            {"Don't have an account yet? "}
            <Link to="/register" className="redirect-btn">
              Register
            </Link>
          </p>
        </form>
      </div>
    </Wrapper>
  );
}

export default Login;
