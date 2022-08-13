import { Link } from "react-router-dom";
import { useState } from "react";

import Wrapper from "../assets/wrappers/Register";

import { useAppContext } from "../context/appContext";
import { FormRow } from "../components";

// initial local state
const initialState = {
  username: "",
  email: "",
  password: "",
};

function Register() {
  // local state
  const [values, setValues] = useState(initialState);

  // get state and functions from global context
  const { registerUser } = useAppContext();

  // handle on change event for updating state values
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  // handle submit function
  const handleSubmit = (e) => {
    e.preventDefault();
    // call register user global context function passing in user inputed information
    const { username, email, password } = values;
    registerUser({ username, email, password });
  };

  return (
    <Wrapper>
      <div className="container">
        {/* form */}
        <form className="form" onSubmit={handleSubmit}>
          {/* title */}
          <h2>sign-up form</h2>

          {/* username */}
          <FormRow
            name="username"
            type="text"
            value={values.username}
            handleChange={handleChange}
          />

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
            Create Account
          </button>
          <p>
            {"Already have an account? "}
            <Link to="/login" className="redirect-btn">
              Login
            </Link>
          </p>
        </form>
      </div>
    </Wrapper>
  );
}

export default Register;
