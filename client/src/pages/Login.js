import { Link } from "react-router-dom";
import { useState } from "react";

import Wrapper from "../assets/wrappers/Register";

import { useAppContext } from "../context/appContext";
import { FormRow } from "../components";

// initial local state
const initialState = {
  email: "",
  password: "",
};

function Login() {
  // local state
  const [values, setValues] = useState(initialState);

  // get state and functions from global context
  const { loginUser } = useAppContext();

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
          <button type="submit" className="btn btn-block">
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
